"""
OP-Katalog Backend API
Provides CRUD operations for surgical operation logging with Postgres persistence
"""

import os
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database error tracking
db_error = None

def get_db_connection():
    """Get a database connection"""
    global db_error
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        db_error = "DATABASE_URL not configured"
        return None
    
    try:
        import psycopg
        from psycopg.rows import dict_row
        
        # Handle Render's postgres:// vs postgresql:// URL format
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        
        conn = psycopg.connect(database_url, row_factory=dict_row)
        db_error = None
        return conn
    except Exception as e:
        db_error = str(e)
        print(f"Database connection error: {e}")
        return None

def init_db():
    """Create the operations table if it doesn't exist"""
    conn = get_db_connection()
    if not conn:
        print(f"Cannot initialize DB: {db_error}")
        return False
    
    try:
        with conn.cursor() as cur:
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
        conn.close()
        print("Database initialized successfully")
        return True
    except Exception as e:
        print(f"Database init error: {e}")
        if conn:
            conn.close()
        return False

@app.route('/api/health')
def health():
    """Health check endpoint - also reports database status"""
    db_status = "disconnected"
    
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT 1")
            conn.close()
            db_status = "connected"
        except Exception as e:
            db_status = f"error: {str(e)}"
            conn.close()
    else:
        db_status = f"error: {db_error}"
    
    return jsonify({
        "status": "ok",
        "database": db_status,
        "timestamp": datetime.utcnow().isoformat()
    })

@app.route('/api/operations', methods=['GET'])
def get_operations():
    """Get all operations for a user"""
    user_id = request.args.get('user_id', 'default')
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": f"Database not available: {db_error}"}), 503
    
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT * FROM op_katalog_operations 
                WHERE user_id = %s 
                ORDER BY date DESC, id DESC
            """, (user_id,))
            rows = cur.fetchall()
        conn.close()
        
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
                'updatedAt': row['updated_at'].isoformat() if row['updated_at'] else None,
            })
        
        return jsonify(operations)
    except Exception as e:
        conn.close()
        return jsonify({"error": str(e)}), 500

@app.route('/api/operations', methods=['POST'])
def create_operation():
    """Create a new operation"""
    data = request.json
    user_id = data.get('userId', 'default')
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": f"Database not available: {db_error}"}), 503
    
    try:
        with conn.cursor() as cur:
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
        conn.close()
        
        return jsonify({"id": result['id'], "success": True})
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"error": str(e)}), 500

@app.route('/api/operations/<int:op_id>', methods=['PUT'])
def update_operation(op_id):
    """Update an existing operation"""
    data = request.json
    user_id = data.get('userId', 'default')
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": f"Database not available: {db_error}"}), 503
    
    try:
        with conn.cursor() as cur:
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
        conn.close()
        
        return jsonify({"success": True})
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"error": str(e)}), 500

@app.route('/api/operations/<int:op_id>', methods=['DELETE'])
def delete_operation(op_id):
    """Delete an operation"""
    user_id = request.args.get('user_id', 'default')
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": f"Database not available: {db_error}"}), 503
    
    try:
        with conn.cursor() as cur:
            cur.execute("""
                DELETE FROM op_katalog_operations 
                WHERE id = %s AND user_id = %s
            """, (op_id, user_id))
            conn.commit()
        conn.close()
        
        return jsonify({"success": True})
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"error": str(e)}), 500

@app.route('/api/operations/bulk', methods=['POST'])
def bulk_import():
    """Import multiple operations (for migration from localStorage)"""
    data = request.json
    user_id = data.get('userId', 'default')
    operations = data.get('operations', [])
    
    if not operations:
        return jsonify({"error": "No operations provided"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": f"Database not available: {db_error}"}), 503
    
    try:
        with conn.cursor() as cur:
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
        conn.close()
        return jsonify({"success": True, "imported": imported})
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"error": str(e)}), 500

@app.route('/api/operations/clear', methods=['DELETE'])
def clear_operations():
    """Clear all operations for a user"""
    user_id = request.args.get('user_id', 'default')
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": f"Database not available: {db_error}"}), 503
    
    try:
        with conn.cursor() as cur:
            cur.execute("""
                DELETE FROM op_katalog_operations WHERE user_id = %s
            """, (user_id,))
            deleted = cur.rowcount
            conn.commit()
        conn.close()
        
        return jsonify({"success": True, "deleted": deleted})
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"error": str(e)}), 500

# Try to initialize database on startup
print("Starting OP-Katalog API...")
print(f"DATABASE_URL configured: {'Yes' if os.environ.get('DATABASE_URL') else 'No'}")

if os.environ.get('DATABASE_URL'):
    if init_db():
        print("✓ Database ready")
    else:
        print("✗ Database initialization failed - will retry on first request")
else:
    print("✗ No DATABASE_URL - running without database")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
