import { useState } from 'react';
import type { Operation } from '../types/Operation';
import { siwfCatalog, getRegionById } from '../data/siwfCatalog';

interface Props {
  operations: Operation[];
  onEdit: (op: Operation) => void;
  onDelete: (id: number) => void;
}

export function OperationList({ operations, onEdit, onDelete }: Props) {
  const [filter, setFilter] = useState<'all' | 'operateur' | 'assistent'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'id'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredOps = operations
    .filter(op => {
      if (filter !== 'all' && op.role !== filter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          op.patientName.toLowerCase().includes(term) ||
          op.diagnosis.toLowerCase().includes(term) ||
          op.operationShort.toLowerCase().includes(term) ||
          op.operationRaw.toLowerCase().includes(term)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const aVal = sortBy === 'date' ? new Date(a.date).getTime() : a.id;
      const bVal = sortBy === 'date' ? new Date(b.date).getTime() : b.id;
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const getProcedureNames = (op: Operation) => {
    return op.procedures.map(proc => {
      const teil = siwfCatalog.find(t => t.id === proc.teilId);
      const gruppe = teil?.gruppen.find(g => g.id === proc.gruppeId);
      const procedure = gruppe?.procedures.find(p => p.id === proc.procedureId);
      return procedure?.nameShort || procedure?.name || proc.procedureId;
    });
  };

  const getRegionNames = (op: Operation) => {
    return op.anatomicalRegions.map(r => getRegionById(r)?.nameShort || r);
  };

  if (operations.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">Keine Operationen</h3>
        <p className="text-slate-500">Fügen Sie Ihre erste Operation hinzu</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Suchen..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input flex-1 min-w-[200px]"
          />
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 rounded-lg text-sm ${
                filter === 'all' ? 'bg-slate-600' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              Alle ({operations.length})
            </button>
            <button
              onClick={() => setFilter('operateur')}
              className={`px-3 py-2 rounded-lg text-sm ${
                filter === 'operateur' ? 'bg-emerald-600' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              Operateur ({operations.filter(o => o.role === 'operateur').length})
            </button>
            <button
              onClick={() => setFilter('assistent')}
              className={`px-3 py-2 rounded-lg text-sm ${
                filter === 'assistent' ? 'bg-amber-600' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              Assistent ({operations.filter(o => o.role === 'assistent').length})
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'date' | 'id')}
              className="input py-2"
            >
              <option value="date">Nach Datum</option>
              <option value="id">Nach ID</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-slate-400">
        {filteredOps.length} von {operations.length} Operationen
      </div>

      {/* Operation Cards */}
      <div className="space-y-3">
        {filteredOps.map(op => (
          <div key={op.id} className="card hover:border-slate-600 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-mono text-slate-500">#{op.id}</span>
                  <span className="text-sm text-slate-400">{op.date}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    op.role === 'operateur' 
                      ? 'bg-emerald-600/30 text-emerald-400' 
                      : 'bg-amber-600/30 text-amber-400'
                  }`}>
                    {op.role === 'operateur' ? 'Operateur' : 'Assistent'}
                  </span>
                </div>
                
                <h4 className="font-semibold text-white mb-1 truncate">
                  {op.operationShort || op.operationRaw}
                </h4>
                
                {op.patientName && (
                  <p className="text-sm text-slate-400 mb-1">
                    {op.patientName} {op.patientId && `(${op.patientId})`}
                  </p>
                )}
                
                {op.diagnosis && (
                  <p className="text-sm text-slate-500 mb-2">{op.diagnosis}</p>
                )}

                <div className="flex flex-wrap gap-1 mb-2">
                  {getProcedureNames(op).map((name, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-purple-600/30 text-purple-300 rounded text-xs">
                      {name}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1">
                  {getRegionNames(op).map((name, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-blue-600/30 text-blue-300 rounded text-xs">
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(op)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                  title="Bearbeiten"
                >
                  ✏️
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Operation #${op.id} wirklich löschen?`)) {
                      onDelete(op.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-all"
                  title="Löschen"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

