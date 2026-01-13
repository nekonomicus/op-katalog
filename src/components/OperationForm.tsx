import { useState, useEffect } from 'react';
import type { OperationFormData, ProcedureClassification } from '../types/Operation';
import { 
  siwfCatalog, 
  anatomicalRegions, 
  implantTypes, 
  type Teil, 
  type Gruppe,
} from '../data/siwfCatalog';

interface Props {
  onSubmit: (data: OperationFormData) => void;
  initialData?: Partial<OperationFormData>;
  isEditing?: boolean;
}

const emptyForm: OperationFormData = {
  date: new Date().toISOString().split('T')[0],
  patientId: '',
  patientName: '',
  patientDob: '',
  diagnosis: '',
  operationRaw: '',
  operationShort: '',
  role: 'operateur',
  anatomicalRegions: [],
  procedures: [],
  implantTypes: [],
  notes: '',
};

// Tooltip component with hover-to-discover - shows FULL NAME in button
function TeilTooltip({ teil, isSelected, onClick }: { teil: Teil; isSelected: boolean; onClick: () => void }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Get all gruppen for this Teil (including from subKategorien)
  const gruppen: Gruppe[] = [];
  for (const g of teil.gruppen) {
    gruppen.push(g);
  }
  if (teil.subKategorien) {
    for (const sub of teil.subKategorien) {
      for (const g of sub.gruppen) {
        gruppen.push(g);
      }
    }
  }
  
  // Extract short name from "Teil X Something" -> "Something"
  const shortName = teil.name.replace(/^Teil \d+ /, '');
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`w-full p-3 rounded-lg text-sm font-medium transition-all ${
          isSelected
            ? 'bg-purple-600 text-white ring-2 ring-purple-400'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }`}
      >
        <div className="flex flex-col items-start gap-1">
          <span className="text-[10px] opacity-70 font-bold">T{teil.teilNum}</span>
          <span className="text-left leading-tight">{shortName}</span>
        </div>
        <span className="absolute top-1 right-1 text-[10px] opacity-60">ⓘ</span>
      </button>
      
      {showTooltip && (
        <div className="absolute z-50 left-0 top-full mt-1 w-72 p-3 bg-slate-800 border border-slate-600 rounded-lg shadow-xl text-xs">
          <div className="font-semibold text-cyan-400 mb-2">{teil.name}</div>
          <div className="text-slate-400 mb-2">
            Max: {teil.maximum} | Verantwortlich Soll: {teil.verantwortlichSoll} | Assistent Soll: {teil.assistentSoll}
          </div>
          <div className="space-y-1">
            <div className="text-slate-300 font-medium">Gruppen ({gruppen.length}):</div>
            {gruppen.map(g => (
              <div key={g.id} className="text-slate-400 pl-2 border-l border-slate-600">
                • {g.name} (Max {g.maximum})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GruppeTooltip({ gruppe, isSelected, onClick }: { gruppe: Gruppe; isSelected: boolean; onClick: () => void }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`w-full p-3 rounded-lg text-sm font-medium transition-all text-left ${
          isSelected
            ? 'bg-purple-600 text-white ring-2 ring-purple-400'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }`}
      >
        <div className="flex flex-col items-start gap-1">
          <span className="text-[10px] opacity-70 font-bold">G{gruppe.gruppeNum}</span>
          <span className="leading-tight text-xs">{gruppe.name}</span>
        </div>
        <span className="absolute top-1 right-1 text-[10px] opacity-60 flex-shrink-0">ⓘ</span>
      </button>
      
      {showTooltip && (
        <div className="absolute z-50 left-0 top-full mt-1 w-80 p-3 bg-slate-800 border border-slate-600 rounded-lg shadow-xl text-xs max-h-96 overflow-y-auto">
          <div className="font-semibold text-cyan-400 mb-2">{gruppe.name}</div>
          <div className="text-slate-400 mb-2">
            Max: {gruppe.maximum} | Verantwortl.: {gruppe.verantwortlichSoll} | Assist.: {gruppe.assistentSoll}
          </div>
          <div className="space-y-1">
            <div className="text-slate-300 font-medium">Prozeduren ({gruppe.procedures.length}):</div>
            {gruppe.procedures.map(p => (
              <div key={p.id} className="text-slate-400 pl-2 border-l border-slate-600 py-0.5">
                • {p.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function OperationForm({ onSubmit, initialData, isEditing }: Props) {
  const [form, setForm] = useState<OperationFormData>({ ...emptyForm, ...initialData });
  const [selectedTeil, setSelectedTeil] = useState<string>('');
  const [selectedGruppe, setSelectedGruppe] = useState<string>('');
  
  useEffect(() => {
    if (initialData) {
      setForm({ ...emptyForm, ...initialData });
    }
  }, [initialData]);

  const handleChange = (field: keyof OperationFormData, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addProcedure = (procedureId: string) => {
    if (!selectedTeil || !selectedGruppe) return;
    
    const newProc: ProcedureClassification = {
      teilId: selectedTeil,
      gruppeId: selectedGruppe,
      procedureId,
    };
    
    // Avoid duplicates
    const exists = form.procedures.some(
      p => p.procedureId === procedureId && p.gruppeId === selectedGruppe
    );
    
    if (!exists) {
      handleChange('procedures', [...form.procedures, newProc]);
    }
  };

  const removeProcedure = (index: number) => {
    handleChange('procedures', form.procedures.filter((_, i) => i !== index));
  };

  const toggleRegion = (regionId: string) => {
    if (form.anatomicalRegions.includes(regionId)) {
      handleChange('anatomicalRegions', form.anatomicalRegions.filter(r => r !== regionId));
    } else {
      handleChange('anatomicalRegions', [...form.anatomicalRegions, regionId]);
    }
  };

  const toggleImplant = (implantId: string) => {
    if (form.implantTypes.includes(implantId)) {
      handleChange('implantTypes', form.implantTypes.filter(i => i !== implantId));
    } else {
      handleChange('implantTypes', [...form.implantTypes, implantId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    if (!isEditing) {
      setForm({ ...emptyForm, date: form.date }); // Keep the date
      setSelectedTeil('');
      setSelectedGruppe('');
    }
  };

  // Get current Teil and all its Gruppen (including from subKategorien)
  const currentTeil = siwfCatalog.find(t => t.id === selectedTeil);
  const currentGruppen: Gruppe[] = [];
  if (currentTeil) {
    for (const g of currentTeil.gruppen) {
      currentGruppen.push(g);
    }
    if (currentTeil.subKategorien) {
      for (const sub of currentTeil.subKategorien) {
        for (const g of sub.gruppen) {
          currentGruppen.push(g);
        }
      }
    }
  }
  const currentGruppe = currentGruppen.find(g => g.id === selectedGruppe);

  const getProcedureName = (proc: ProcedureClassification) => {
    const teil = siwfCatalog.find(t => t.id === proc.teilId);
    if (!teil) return proc.procedureId;
    
    // Check direct gruppen
    for (const gruppe of teil.gruppen) {
      const procedure = gruppe.procedures.find(p => p.id === proc.procedureId);
      if (procedure) return procedure.name;
    }
    // Check subKategorien
    if (teil.subKategorien) {
      for (const sub of teil.subKategorien) {
        for (const gruppe of sub.gruppen) {
          const procedure = gruppe.procedures.find(p => p.id === proc.procedureId);
          if (procedure) return procedure.name;
        }
      }
    }
    return proc.procedureId;
  };

  const getTeilCode = (teilId: string) => {
    const teil = siwfCatalog.find(t => t.id === teilId);
    return teil ? `T${teil.teilNum}` : teilId;
  };

  const hasOsteosynthese = form.procedures.some(p => p.teilId === 'teil4');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Info */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-cyan-400">Patient</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="label">Datum</label>
            <input
              type="date"
              value={form.date}
              onChange={e => handleChange('date', e.target.value)}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Patient ID</label>
            <input
              type="text"
              value={form.patientId}
              onChange={e => handleChange('patientId', e.target.value)}
              className="input"
              placeholder="z.B. 12345678"
            />
          </div>
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              value={form.patientName}
              onChange={e => handleChange('patientName', e.target.value)}
              className="input"
              placeholder="Nachname, Vorname"
            />
          </div>
          <div>
            <label className="label">Geburtsdatum</label>
            <input
              type="date"
              value={form.patientDob}
              onChange={e => handleChange('patientDob', e.target.value)}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Operation Info */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-cyan-400">Operation</h3>
        <div className="space-y-4">
          <div>
            <label className="label">Diagnose</label>
            <input
              type="text"
              value={form.diagnosis}
              onChange={e => handleChange('diagnosis', e.target.value)}
              className="input"
              placeholder="z.B. Coxarthrose rechts"
            />
          </div>
          <div>
            <label className="label">Operation (Roh aus Epic)</label>
            <textarea
              value={form.operationRaw}
              onChange={e => handleChange('operationRaw', e.target.value)}
              className="input"
              rows={2}
              placeholder="Vollständiger OP-Name aus Epic kopieren"
            />
          </div>
          <div>
            <label className="label">Operation (Kurz)</label>
            <input
              type="text"
              value={form.operationShort}
              onChange={e => handleChange('operationShort', e.target.value)}
              className="input"
              placeholder="z.B. Hüft-TEP rechts"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Dauer (Minuten)</label>
              <input
                type="number"
                value={form.duration || ''}
                onChange={e => handleChange('duration', e.target.value ? parseInt(e.target.value) : undefined)}
                className="input"
                placeholder="z.B. 120"
              />
            </div>
            <div>
              <label className="label">Chirurg</label>
              <input
                type="text"
                value={form.surgeon || ''}
                onChange={e => handleChange('surgeon', e.target.value)}
                className="input"
                placeholder="Name des Operateurs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-cyan-400">Rolle</h3>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleChange('role', 'operateur')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              form.role === 'operateur'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Verantwortlich (Operateur)
          </button>
          <button
            type="button"
            onClick={() => handleChange('role', 'assistent')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              form.role === 'assistent'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Assistent
          </button>
        </div>
      </div>

      {/* Anatomical Regions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-2 text-cyan-400">Anatomische Region(en)</h3>
        <p className="text-xs text-slate-500 mb-4">
          Nebenkriterium: Min. 175 Verantwortlich-Eingriffe verteilt auf alle Regionen
        </p>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-slate-400 mb-2">Obere Extremität</h4>
            <div className="flex flex-wrap gap-2">
              {anatomicalRegions.filter(r => r.category === 'upper').map(region => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => toggleRegion(region.id)}
                  title={`${region.name} - Min ${region.minimumOperateur} als Verantwortlich`}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    form.anatomicalRegions.includes(region.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {region.nameShort}
                  <span className="ml-1 text-[10px] opacity-60">({region.minimumOperateur})</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-400 mb-2">Untere Extremität</h4>
            <div className="flex flex-wrap gap-2">
              {anatomicalRegions.filter(r => r.category === 'lower').map(region => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => toggleRegion(region.id)}
                  title={`${region.name} - Min ${region.minimumOperateur} als Verantwortlich`}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    form.anatomicalRegions.includes(region.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {region.nameShort}
                  <span className="ml-1 text-[10px] opacity-60">({region.minimumOperateur})</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-400 mb-2">Axial</h4>
            <div className="flex flex-wrap gap-2">
              {anatomicalRegions.filter(r => r.category === 'axial').map(region => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => toggleRegion(region.id)}
                  title={`${region.name} - Min ${region.minimumOperateur} als Verantwortlich`}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    form.anatomicalRegions.includes(region.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {region.nameShort}
                  <span className="ml-1 text-[10px] opacity-60">({region.minimumOperateur})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SIWF Classification */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-2 text-cyan-400">SIWF Klassifikation</h3>
        <p className="text-xs text-slate-500 mb-4">
          Hover über Teil/Gruppe für Details • Eine OP kann mehrere Prozeduren haben
        </p>
        
        {/* Selected Procedures */}
        {form.procedures.length > 0 && (
          <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <h4 className="text-sm font-medium text-slate-400 mb-2">
              Ausgewählte Prozeduren ({form.procedures.length}):
            </h4>
            <div className="space-y-2">
              {form.procedures.map((proc, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-2 p-2 bg-purple-600/30 border border-purple-500 rounded-lg text-sm"
                >
                  <div>
                    <span className="text-purple-300 text-xs font-medium">{getTeilCode(proc.teilId)}</span>
                    <span className="text-white ml-2">{getProcedureName(proc)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProcedure(idx)}
                    className="text-red-400 hover:text-red-300 flex-shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teil Selection with Tooltips */}
        <div className="space-y-4">
          <div>
            <label className="label flex items-center gap-2">
              Teil 
              <span className="text-[10px] text-slate-500">(Hover für Details)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {siwfCatalog.map(teil => (
                <TeilTooltip
                  key={teil.id}
                  teil={teil}
                  isSelected={selectedTeil === teil.id}
                  onClick={() => {
                    setSelectedTeil(teil.id);
                    setSelectedGruppe('');
                  }}
                />
              ))}
            </div>
          </div>

          {/* Gruppe Selection with Tooltips */}
          {currentTeil && currentGruppen.length > 0 && (
            <div>
              <label className="label flex items-center gap-2">
                Gruppe in {currentTeil.name}
                <span className="text-[10px] text-slate-500">(Hover für Prozeduren)</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {currentGruppen.map(gruppe => (
                  <GruppeTooltip
                    key={gruppe.id}
                    gruppe={gruppe}
                    isSelected={selectedGruppe === gruppe.id}
                    onClick={() => setSelectedGruppe(gruppe.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Procedure Selection */}
          {currentGruppe && (
            <div>
              <label className="label">
                Prozedur auswählen aus {currentGruppe.name}
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto p-1">
                {currentGruppe.procedures.map(proc => {
                  const isAdded = form.procedures.some(p => p.procedureId === proc.id && p.gruppeId === currentGruppe.id);
                  return (
                    <button
                      key={proc.id}
                      type="button"
                      onClick={() => addProcedure(proc.id)}
                      disabled={isAdded}
                      className={`p-3 rounded-lg text-sm text-left transition-all ${
                        isAdded
                          ? 'bg-purple-600/50 border border-purple-500 cursor-not-allowed opacity-60'
                          : 'bg-slate-700 hover:bg-slate-600 border border-transparent'
                      }`}
                    >
                      <div className="font-medium">{proc.name}</div>
                      {proc.maximum && <div className="text-xs text-slate-400 mt-1">Max: {proc.maximum}</div>}
                      {isAdded && <div className="text-xs text-purple-300 mt-1">✓ Hinzugefügt</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Implant Types (for Osteosynthesen) */}
      {hasOsteosynthese && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-2 text-cyan-400">Implantat-Typ</h3>
          <p className="text-xs text-slate-500 mb-4">
            Teil 4: Min. 10 Marknagel, 20 Platte, 10 Fixateur/K-Draht
          </p>
          <div className="flex flex-wrap gap-2">
            {implantTypes.map(implant => (
              <button
                key={implant.id}
                type="button"
                onClick={() => toggleImplant(implant.id)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  form.implantTypes.includes(implant.id)
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {implant.name}
                <span className="ml-1 text-xs opacity-60">(Soll {implant.verantwortlichSoll})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-cyan-400">Notizen</h3>
        <textarea
          value={form.notes}
          onChange={e => handleChange('notes', e.target.value)}
          className="input"
          rows={3}
          placeholder="Zusätzliche Informationen..."
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={form.procedures.length === 0}
        className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isEditing ? 'Operation aktualisieren' : 'Operation speichern'}
      </button>
    </form>
  );
}
