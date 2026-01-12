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

// Generate timestamp for filenames: YYYY-MM-DD_HH-MM
function getTimestamp() {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().slice(0, 5).replace(':', '-');
  return `${date}_${time}`;
}

export function ExportPanel({ operations, onImport, onClear }: Props) {
  const [showElog, setShowElog] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(
    localStorage.getItem('op-katalog-last-backup')
  );

  const handleExportCSV = () => {
    const csv = generateProCSV(operations);
    const timestamp = getTimestamp();
    downloadFile(csv, `op-katalog_${timestamp}.csv`, 'text/csv');
  };

  const handleExportJSON = (isQuickBackup = false) => {
    const json = JSON.stringify(operations, null, 2);
    const timestamp = getTimestamp();
    downloadFile(json, `op-katalog-backup_${timestamp}.json`, 'application/json');
    
    // Track last backup
    const now = new Date().toISOString();
    localStorage.setItem('op-katalog-last-backup', now);
    setLastBackup(now);
    
    if (isQuickBackup) {
      // Visual feedback
      const btn = document.getElementById('quick-backup-btn');
      if (btn) {
        btn.textContent = '✅ Gesichert!';
        setTimeout(() => {
          btn.textContent = '💾 Schnell-Backup';
        }, 2000);
      }
    }
  };

  const handleExportElog = () => {
    const elog = generateElogFormat(operations);
    const timestamp = getTimestamp();
    downloadFile(elog, `elog-export_${timestamp}.txt`, 'text/plain');
  };

  const handleExportSunburst = () => {
    const summary = generateSunburstSummary(operations);
    
    // Create a simple format for updating the sunburst Excel
    const lines = [
      'SUNBURST SUMMARY - OP-Katalog Export',
      '=====================================',
      `Exportiert: ${new Date().toLocaleString('de-CH')}`,
      `Anzahl Operationen: ${operations.length}`,
      '',
      'OPERATEUR:',
      `  Prothetik: ${summary.operateur.prothetik}`,
      `  Osteotomien und Arthrodesen: ${summary.operateur.osteotomien}`,
      `  Rekonstruktive Eingriffe: ${summary.operateur.rekonstruktiv}`,
      `  Osteosynthesen: ${summary.operateur.osteosynthesen}`,
      `  Diverses: ${summary.operateur.diverses}`,
      `  TOTAL: ${Object.values(summary.operateur).reduce((a, b) => a + b, 0)}`,
      '',
      'ASSISTENT:',
      `  Prothetik: ${summary.assistent.prothetik}`,
      `  Osteotomien und Arthrodesen: ${summary.assistent.osteotomien}`,
      `  Rekonstruktive Eingriffe: ${summary.assistent.rekonstruktiv}`,
      `  Osteosynthesen: ${summary.assistent.osteosynthesen}`,
      `  Diverses: ${summary.assistent.diverses}`,
      `  TOTAL: ${Object.values(summary.assistent).reduce((a, b) => a + b, 0)}`,
    ];
    
    const timestamp = getTimestamp();
    downloadFile(lines.join('\n'), `sunburst-summary_${timestamp}.txt`, 'text/plain');
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

  // Calculate days since last backup
  const daysSinceBackup = lastBackup 
    ? Math.floor((Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
  const backupWarning = daysSinceBackup !== null && daysSinceBackup > 7;

  return (
    <div className="space-y-6">
      {/* Backup Warning */}
      {operations.length > 0 && (
        <div className={`p-4 rounded-xl border ${
          backupWarning 
            ? 'bg-amber-900/30 border-amber-600' 
            : 'bg-emerald-900/30 border-emerald-700'
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{backupWarning ? '⚠️' : '💾'}</span>
            <div className="flex-1">
              <h4 className={`font-semibold ${backupWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                {backupWarning ? 'Backup empfohlen!' : 'Backup-Status'}
              </h4>
              <p className="text-sm text-slate-400 mt-1">
                {lastBackup 
                  ? `Letztes Backup: ${new Date(lastBackup).toLocaleString('de-CH')} (vor ${daysSinceBackup} Tagen)`
                  : 'Noch kein Backup erstellt'
                }
              </p>
              <p className="text-xs text-slate-500 mt-1">
                ⚡ Daten in localStorage können bei Browser-Reset verloren gehen. Regelmässig exportieren!
              </p>
            </div>
            <button
              id="quick-backup-btn"
              onClick={() => handleExportJSON(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                backupWarning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              💾 Schnell-Backup
            </button>
          </div>
        </div>
      )}

      {/* Export Section */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-2 text-cyan-400">Export</h3>
        <p className="text-xs text-slate-500 mb-4">
          Alle Exporte enthalten Datum + Uhrzeit im Dateinamen für Versionierung
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={handleExportCSV}
            disabled={operations.length === 0}
            className="p-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl transition-all"
          >
            <div className="text-2xl mb-1">📊</div>
            <div className="font-semibold">Pro CSV</div>
            <div className="text-xs opacity-75">Für Python/Excel</div>
          </button>
          
          <button
            onClick={() => handleExportJSON(false)}
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
        
        {/* Export History Hint */}
        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
          <p className="text-xs text-slate-400">
            💡 <strong>Tipp:</strong> Exportiere regelmässig Backups. Dateien werden automatisch mit Timestamp benannt:
            <br />
            <code className="text-cyan-400">op-katalog-backup_2026-01-12_17-30.json</code>
          </p>
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
          <h3 className="text-lg font-semibold text-cyan-400">Import / Wiederherstellen</h3>
          <button
            onClick={() => setShowImport(!showImport)}
            className="text-sm text-slate-400 hover:text-white"
          >
            {showImport ? 'Ausblenden' : 'Anzeigen'}
          </button>
        </div>
        
        {showImport && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
              <p className="text-sm text-blue-300">
                🔄 Hier kannst du ein früheres Backup wiederherstellen. Die Daten werden zu deinen bestehenden hinzugefügt (keine Duplikate bei gleicher ID).
              </p>
            </div>
            
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
        <h3 className="text-lg font-semibold mb-4 text-red-400">⚠️ Gefahrenzone</h3>
        <p className="text-sm text-slate-400 mb-4">
          Diese Aktionen können nicht rückgängig gemacht werden. <strong>Erstelle vorher ein Backup!</strong>
        </p>
        <button
          onClick={() => {
            if (confirm(`Wirklich alle ${operations.length} Operationen löschen? Diese Aktion kann nicht rückgängig gemacht werden!`)) {
              onClear();
            }
          }}
          disabled={operations.length === 0}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-sm"
        >
          🗑️ Alle Operationen löschen ({operations.length})
        </button>
      </div>
    </div>
  );
}
