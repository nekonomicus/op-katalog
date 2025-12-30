import { useState, useEffect } from 'react';
import type { OperationFormData, ProcedureClassification } from '../types/Operation';
import { siwfCatalog, anatomicalRegions, implantTypes } from '../data/siwfCatalog';

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

  const currentTeil = siwfCatalog.find(t => t.id === selectedTeil);
  const currentGruppe = currentTeil?.gruppen.find(g => g.id === selectedGruppe);

  const getProcedureName = (proc: ProcedureClassification) => {
    const teil = siwfCatalog.find(t => t.id === proc.teilId);
    const gruppe = teil?.gruppen.find(g => g.id === proc.gruppeId);
    const procedure = gruppe?.procedures.find(p => p.id === proc.procedureId);
    return procedure?.nameShort || procedure?.name || proc.procedureId;
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
            Operateur
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
        <h3 className="text-lg font-semibold mb-4 text-cyan-400">Anatomische Region(en)</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-slate-400 mb-2">Obere Extremität</h4>
            <div className="flex flex-wrap gap-2">
              {anatomicalRegions.filter(r => r.category === 'upper').map(region => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => toggleRegion(region.id)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    form.anatomicalRegions.includes(region.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {region.nameShort}
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
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    form.anatomicalRegions.includes(region.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {region.nameShort}
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
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    form.anatomicalRegions.includes(region.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {region.nameShort}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SIWF Classification */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-cyan-400">SIWF Klassifikation</h3>
        
        {/* Selected Procedures */}
        {form.procedures.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-slate-400 mb-2">Ausgewählte Prozeduren:</h4>
            <div className="flex flex-wrap gap-2">
              {form.procedures.map((proc, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600/30 border border-purple-500 rounded-lg text-sm"
                >
                  {getProcedureName(proc)}
                  <button
                    type="button"
                    onClick={() => removeProcedure(idx)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Teil Selection */}
        <div className="space-y-4">
          <div>
            <label className="label">Teil</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {siwfCatalog.map(teil => (
                <button
                  key={teil.id}
                  type="button"
                  onClick={() => {
                    setSelectedTeil(teil.id);
                    setSelectedGruppe('');
                  }}
                  className={`p-2 rounded-lg text-xs font-medium transition-all ${
                    selectedTeil === teil.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {teil.nameShort}
                </button>
              ))}
            </div>
          </div>

          {/* Gruppe Selection */}
          {currentTeil && (
            <div>
              <label className="label">Gruppe</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {currentTeil.gruppen.map(gruppe => (
                  <button
                    key={gruppe.id}
                    type="button"
                    onClick={() => setSelectedGruppe(gruppe.id)}
                    className={`p-2 rounded-lg text-xs font-medium transition-all ${
                      selectedGruppe === gruppe.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {gruppe.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Procedure Selection */}
          {currentGruppe && (
            <div>
              <label className="label">Prozedur auswählen</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {currentGruppe.procedures.map(proc => (
                  <button
                    key={proc.id}
                    type="button"
                    onClick={() => addProcedure(proc.id)}
                    className={`p-2 rounded-lg text-xs text-left transition-all ${
                      form.procedures.some(p => p.procedureId === proc.id)
                        ? 'bg-purple-600/50 border border-purple-500'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {proc.nameShort || proc.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Implant Types (for Osteosynthesen) */}
      {hasOsteosynthese && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">Implantat-Typ</h3>
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

