"""
OP-Katalog Backend API
Provides CRUD operations for surgical operation logging with Postgres persistence
"""

import os
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import psycopg2.pool

app = Flask(__name__)
CORS(app)

# Database connection pool
db_pool = None

def get_db_pool():
    global db_pool
    if db_pool is None:
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            raise Exception("DATABASE_URL not set")
        db_pool = psycopg2.pool.SimpleConnectionPool(1, 10, database_url)
    return db_pool

def get_db():
    return get_db_pool().getconn()

def put_db(conn):
    get_db_pool().putconn(conn)

def init_db():
    """Create the operations table if it doesn't exist"""
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS op_katalog_operations (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) DEFAULT 'default',
                date DATE,
                patient_id VARCHAR(255),
                patient_name VARCHAR(255),
                patient_dob DATE,
                diagnosis TEXT,
                operation_raw TEXT,
                operation_short VARCHAR(255),
                role VARCHAR(50),
                anatomical_regions JSONB,
                procedures JSONB,
                implant_types JSONB,
                notes TEXT,
                duration INTEGER,
                surgeon VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE INDEX IF NOT EXISTS idx_op_katalog_user ON op_katalog_operations(user_id);
            CREATE INDEX IF NOT EXISTS idx_op_katalog_date ON op_katalog_operations(date);
        """)
        conn.commit()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Database init error: {e}")
        conn.rollback()
    finally:
        cur.close()
        put_db(conn)

@app.route('/api/health')
def health():
    return jsonify({"status": "ok", "timestamp": datetime.utcnow().isoformat()})

@app.route('/api/operations', methods=['GET'])
def get_operations():
    """Get all operations for a user"""
    user_id = request.args.get('user_id', 'default')
    
    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT * FROM op_katalog_operations 
            WHERE user_id = %s 
            ORDER BY date DESC, id DESC
        """, (user_id,))
        rows = cur.fetchall()
        
        # Convert to frontend format
        operations = []
        for row in rows:
            operations.append({
                'id': row['id'],
                'date': row['date'].isoformat() if row['date'] else None,
                'patientId': row['patient_id'],
                'patientName': row['patient_name'],
                'patientDob': row['patient_dob'].isoformat() if row['patient_dob'] else None,
                'diagnosis': row['diagnosis'],
                'operationRaw': row['operation_raw'],
                'operationShort': row['operation_short'],
                'role': row['role'],
                'anatomicalRegions': row['anatomical_regions'] or [],
                'procedures': row['procedures'] or [],
                'implantTypes': row['implant_types'] or [],
                'notes': row['notes'],
                'duration': row['duration'],
                'surgeon': row['surgeon'],
                'createdAt': row['created_at'].isoformat() if row['created_at'] else None,
            })
        
        return jsonify(operations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        put_db(conn)

@app.route('/api/operations', methods=['POST'])
def create_operation():
    """Create a new operation"""
    data = request.json
    user_id = data.get('userId', 'default')
    
    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            INSERT INTO op_katalog_operations 
            (user_id, date, patient_id, patient_name, patient_dob, diagnosis, 
             operation_raw, operation_short, role, anatomical_regions, 
             procedures, implant_types, notes, duration, surgeon)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            user_id,
            data.get('date'),
            data.get('patientId'),
            data.get('patientName'),
            data.get('patientDob') or None,
            data.get('diagnosis'),
            data.get('operationRaw'),
            data.get('operationShort'),
            data.get('role'),
            json.dumps(data.get('anatomicalRegions', [])),
            json.dumps(data.get('procedures', [])),
            json.dumps(data.get('implantTypes', [])),
            data.get('notes'),
            data.get('duration'),
            data.get('surgeon'),
        ))
        result = cur.fetchone()
        conn.commit()
        
        return jsonify({"id": result['id'], "success": True})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        put_db(conn)

@app.route('/api/operations/<int:op_id>', methods=['PUT'])
def update_operation(op_id):
    """Update an existing operation"""
    data = request.json
    user_id = data.get('userId', 'default')
    
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute("""
            UPDATE op_katalog_operations SET
                date = %s,
                patient_id = %s,
                patient_name = %s,
                patient_dob = %s,
                diagnosis = %s,
                operation_raw = %s,
                operation_short = %s,
                role = %s,
                anatomical_regions = %s,
                procedures = %s,
                implant_types = %s,
                notes = %s,
                duration = %s,
                surgeon = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s AND user_id = %s
        """, (
            data.get('date'),
            data.get('patientId'),
            data.get('patientName'),
            data.get('patientDob') or None,
            data.get('diagnosis'),
            data.get('operationRaw'),
            data.get('operationShort'),
            data.get('role'),
            json.dumps(data.get('anatomicalRegions', [])),
            json.dumps(data.get('procedures', [])),
            json.dumps(data.get('implantTypes', [])),
            data.get('notes'),
            data.get('duration'),
            data.get('surgeon'),
            op_id,
            user_id,
        ))
        conn.commit()
        
        return jsonify({"success": True})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        put_db(conn)

@app.route('/api/operations/<int:op_id>', methods=['DELETE'])
def delete_operation(op_id):
    """Delete an operation"""
    user_id = request.args.get('user_id', 'default')
    
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute("""
            DELETE FROM op_katalog_operations 
            WHERE id = %s AND user_id = %s
        """, (op_id, user_id))
        conn.commit()
        
        return jsonify({"success": True})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        put_db(conn)

@app.route('/api/operations/bulk', methods=['POST'])
def bulk_import():
    """Import multiple operations (for migration from localStorage)"""
    data = request.json
    user_id = data.get('userId', 'default')
    operations = data.get('operations', [])
    
    if not operations:
        return jsonify({"error": "No operations provided"}), 400
    
    conn = get_db()
    try:
        cur = conn.cursor()
        imported = 0
        
        for op in operations:
            cur.execute("""
                INSERT INTO op_katalog_operations 
                (user_id, date, patient_id, patient_name, patient_dob, diagnosis, 
                 operation_raw, operation_short, role, anatomical_regions, 
                 procedures, implant_types, notes, duration, surgeon)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                user_id,
                op.get('date'),
                op.get('patientId'),
                op.get('patientName'),
                op.get('patientDob') or None,
                op.get('diagnosis'),
                op.get('operationRaw'),
                op.get('operationShort'),
                op.get('role'),
                json.dumps(op.get('anatomicalRegions', [])),
                json.dumps(op.get('procedures', [])),
                json.dumps(op.get('implantTypes', [])),
                op.get('notes'),
                op.get('duration'),
                op.get('surgeon'),
            ))
            imported += 1
        
        conn.commit()
        return jsonify({"success": True, "imported": imported})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        put_db(conn)

@app.route('/api/operations/clear', methods=['DELETE'])
def clear_operations():
    """Clear all operations for a user"""
    user_id = request.args.get('user_id', 'default')
    
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute("""
            DELETE FROM op_katalog_operations WHERE user_id = %s
        """, (user_id,))
        deleted = cur.rowcount
        conn.commit()
        
        return jsonify({"success": True, "deleted": deleted})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        put_db(conn)

# Initialize database on startup
with app.app_context():
    try:
        init_db()
    except Exception as e:
        print(f"Could not initialize DB on startup: {e}")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

