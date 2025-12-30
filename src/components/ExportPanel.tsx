import { useState } from 'react';
import type { Operation } from '../types/Operation';
import { 
  generateProCSV, 
  generateElogFormat, 
  generateSunburstSummary,
  downloadFile 
} from '../utils/exports';

interface Props {
  operations: Operation[];
  onImport: (ops: Operation[]) => void;
  onClear: () => void;
}

export function ExportPanel({ operations, onImport, onClear }: Props) {
  const [showElog, setShowElog] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  const handleExportCSV = () => {
    const csv = generateProCSV(operations);
    const date = new Date().toISOString().split('T')[0];
    downloadFile(csv, `op-katalog-${date}.csv`, 'text/csv');
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(operations, null, 2);
    const date = new Date().toISOString().split('T')[0];
    downloadFile(json, `op-katalog-backup-${date}.json`, 'application/json');
  };

  const handleExportElog = () => {
    const elog = generateElogFormat(operations);
    const date = new Date().toISOString().split('T')[0];
    downloadFile(elog, `elog-export-${date}.txt`, 'text/plain');
  };

  const handleExportSunburst = () => {
    const summary = generateSunburstSummary(operations);
    
    // Create a simple format for updating the sunburst Excel
    const lines = [
      'SUNBURST SUMMARY',
      '================',
      '',
      'OPERATEUR:',
      `Prothetik: ${summary.operateur.prothetik}`,
      `Osteotomien und Arthrodesen: ${summary.operateur.osteotomien}`,
      `Rekonstruktive Eingriffe: ${summary.operateur.rekonstruktiv}`,
      `Osteosynthesen: ${summary.operateur.osteosynthesen}`,
      `Diverses: ${summary.operateur.diverses}`,
      '',
      'ASSISTENT:',
      `Prothetik: ${summary.assistent.prothetik}`,
      `Osteotomien und Arthrodesen: ${summary.assistent.osteotomien}`,
      `Rekonstruktive Eingriffe: ${summary.assistent.rekonstruktiv}`,
      `Osteosynthesen: ${summary.assistent.osteosynthesen}`,
      `Diverses: ${summary.assistent.diverses}`,
    ];
    
    const date = new Date().toISOString().split('T')[0];
    downloadFile(lines.join('\n'), `sunburst-summary-${date}.txt`, 'text/plain');
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (Array.isArray(parsed)) {
        onImport(parsed);
        setImportText('');
        setShowImport(false);
        alert(`${parsed.length} Operationen importiert!`);
      } else {
        alert('Ungültiges Format. Erwartet wird ein JSON-Array.');
      }
    } catch (e) {
      alert('Fehler beim Parsen des JSON: ' + (e as Error).message);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          onImport(parsed);
          alert(`${parsed.length} Operationen importiert!`);
        }
      } catch (err) {
        alert('Fehler beim Importieren: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-cyan-400">Export</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={handleExportCSV}
            disabled={operations.length === 0}
            className="p-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl transition-all"
          >
            <div className="text-2xl mb-1">📊</div>
            <div className="font-semibold">Pro CSV</div>
            <div className="text-xs opacity-75">Für Analyse</div>
          </button>
          
          <button
            onClick={handleExportJSON}
            disabled={operations.length === 0}
            className="p-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl transition-all"
          >
            <div className="text-2xl mb-1">💾</div>
            <div className="font-semibold">Backup JSON</div>
            <div className="text-xs opacity-75">Vollständig</div>
          </button>
          
          <button
            onClick={handleExportElog}
            disabled={operations.length === 0}
            className="p-4 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl transition-all"
          >
            <div className="text-2xl mb-1">📋</div>
            <div className="font-semibold">eLog Format</div>
            <div className="text-xs opacity-75">Copy-Paste</div>
          </button>
          
          <button
            onClick={handleExportSunburst}
            disabled={operations.length === 0}
            className="p-4 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl transition-all"
          >
            <div className="text-2xl mb-1">🌞</div>
            <div className="font-semibold">Sunburst</div>
            <div className="text-xs opacity-75">Zusammenfassung</div>
          </button>
        </div>
      </div>

      {/* Preview eLog Format */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-cyan-400">eLog Vorschau</h3>
          <button
            onClick={() => setShowElog(!showElog)}
            className="text-sm text-slate-400 hover:text-white"
          >
            {showElog ? 'Ausblenden' : 'Anzeigen'}
          </button>
        </div>
        
        {showElog && (
          <pre className="bg-slate-900 p-4 rounded-lg text-xs text-slate-300 max-h-96 overflow-auto whitespace-pre-wrap">
            {operations.length > 0 
              ? generateElogFormat(operations.slice(0, 5)) + '\n\n... und mehr'
              : 'Keine Operationen vorhanden'
            }
          </pre>
        )}
      </div>

      {/* Import Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-cyan-400">Import</h3>
          <button
            onClick={() => setShowImport(!showImport)}
            className="text-sm text-slate-400 hover:text-white"
          >
            {showImport ? 'Ausblenden' : 'Anzeigen'}
          </button>
        </div>
        
        {showImport && (
          <div className="space-y-4">
            <div>
              <label className="label">JSON-Datei importieren</label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-700 file:text-white hover:file:bg-slate-600"
              />
            </div>
            
            <div>
              <label className="label">Oder JSON einfügen</label>
              <textarea
                value={importText}
                onChange={e => setImportText(e.target.value)}
                className="input font-mono text-xs"
                rows={5}
                placeholder='[{"id": 1, ...}]'
              />
              <button
                onClick={handleImport}
                disabled={!importText}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 rounded-lg text-sm"
              >
                Importieren
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="card border-red-900">
        <h3 className="text-lg font-semibold mb-4 text-red-400">Gefahrenzone</h3>
        <p className="text-sm text-slate-400 mb-4">
          Diese Aktionen können nicht rückgängig gemacht werden.
        </p>
        <button
          onClick={onClear}
          disabled={operations.length === 0}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-sm"
        >
          Alle Operationen löschen ({operations.length})
        </button>
      </div>
    </div>
  );
}

