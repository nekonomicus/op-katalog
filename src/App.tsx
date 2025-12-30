import { useState } from 'react';
import { useOperations } from './hooks/useOperations';
import { OperationForm } from './components/OperationForm';
import { OperationList } from './components/OperationList';
import { StatsPanel } from './components/StatsPanel';
import { ExportPanel } from './components/ExportPanel';
import type { Operation, OperationFormData } from './types/Operation';

type Tab = 'add' | 'list' | 'stats' | 'export';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('add');
  const [editingOp, setEditingOp] = useState<Operation | null>(null);
  
  const {
    operations,
    isLoaded,
    addOperation,
    updateOperation,
    deleteOperation,
    importOperations,
    clearAllOperations,
  } = useOperations();

  const handleSubmit = (data: OperationFormData) => {
    if (editingOp) {
      updateOperation(editingOp.id, data);
      setEditingOp(null);
    } else {
      addOperation(data);
    }
  };

  const handleEdit = (op: Operation) => {
    setEditingOp(op);
    setActiveTab('add');
  };

  const handleCancelEdit = () => {
    setEditingOp(null);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-xl text-slate-400">Laden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                OP-Katalog
              </h1>
              <p className="text-xs text-slate-500">SIWF Orthopädie & Traumatologie</p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-slate-400">
                {operations.length} Operationen
              </div>
              <div className="text-xs text-slate-500">
                Schaible, Samuel Friedrich
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-800/50 border-b border-slate-700 sticky top-[73px] z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'add' as Tab, label: 'Hinzufügen', icon: '➕' },
              { id: 'list' as Tab, label: 'Liste', icon: '📋' },
              { id: 'stats' as Tab, label: 'Statistik', icon: '📊' },
              { id: 'export' as Tab, label: 'Export', icon: '💾' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== 'add') setEditingOp(null);
                }}
                className={`px-4 py-3 text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-400 bg-slate-800/50'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/30'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {tab.id === 'list' && operations.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-slate-700 rounded text-xs">
                    {operations.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Editing Banner */}
        {editingOp && activeTab === 'add' && (
          <div className="mb-4 p-3 bg-amber-900/30 border border-amber-700 rounded-lg flex items-center justify-between">
            <span className="text-amber-400">
              ✏️ Bearbeite Operation #{editingOp.id}: {editingOp.operationShort || editingOp.operationRaw}
            </span>
            <button
              onClick={handleCancelEdit}
              className="text-sm text-slate-400 hover:text-white"
            >
              Abbrechen
            </button>
          </div>
        )}

        {activeTab === 'add' && (
          <OperationForm
            onSubmit={handleSubmit}
            initialData={editingOp ? {
              date: editingOp.date,
              patientId: editingOp.patientId,
              patientName: editingOp.patientName,
              patientDob: editingOp.patientDob,
              diagnosis: editingOp.diagnosis,
              operationRaw: editingOp.operationRaw,
              operationShort: editingOp.operationShort,
              role: editingOp.role,
              anatomicalRegions: editingOp.anatomicalRegions,
              procedures: editingOp.procedures,
              implantTypes: editingOp.implantTypes || [],
              notes: editingOp.notes,
              duration: editingOp.duration,
              surgeon: editingOp.surgeon,
            } : undefined}
            isEditing={!!editingOp}
          />
        )}

        {activeTab === 'list' && (
          <OperationList
            operations={operations}
            onEdit={handleEdit}
            onDelete={deleteOperation}
          />
        )}

        {activeTab === 'stats' && (
          <StatsPanel operations={operations} />
        )}

        {activeTab === 'export' && (
          <ExportPanel
            operations={operations}
            onImport={importOperations}
            onClear={clearAllOperations}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        <p>OP-Katalog Logger • SIWF Weiterbildungsprogramm 2022</p>
        <p className="text-xs mt-1">Daten werden lokal im Browser gespeichert</p>
      </footer>
    </div>
  );
}

export default App;
