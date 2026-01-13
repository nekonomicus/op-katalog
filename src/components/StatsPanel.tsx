import { useMemo } from 'react';
import type { Operation } from '../types/Operation';
import { generateDetailedStats, generateSunburstSummary } from '../utils/exports';
import { siwfCatalog, anatomicalRegions, type Gruppe } from '../data/siwfCatalog';

interface Props {
  operations: Operation[];
}

function ProgressBar({ current, target, max, label, color }: { 
  current: number; 
  target: number; 
  max?: number;
  label: string;
  color: string;
}) {
  const percent = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;
  
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-300">{label}</span>
        <span className={isComplete ? 'text-emerald-400' : 'text-slate-400'}>
          {current} / {target}
          {max && current > target && ` (max: ${max})`}
          {isComplete && ' ✓'}
        </span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

// Helper to get all Gruppen from a Teil (including subKategorien)
function getAllGruppenFromTeil(teil: typeof siwfCatalog[0]): Gruppe[] {
  const gruppen: Gruppe[] = [...teil.gruppen];
  if (teil.subKategorien) {
    for (const sub of teil.subKategorien) {
      gruppen.push(...sub.gruppen);
    }
  }
  return gruppen;
}

export function StatsPanel({ operations }: Props) {
  const stats = useMemo(() => generateDetailedStats(operations), [operations]);
  const sunburst = useMemo(() => generateSunburstSummary(operations), [operations]);

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-cyan-400">Gesamtfortschritt</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-slate-800 rounded-xl">
            <div className="text-4xl font-bold text-white mb-1">
              {stats.progressToGoal.total.percent}%
            </div>
            <div className="text-sm text-slate-400">Total erfüllt</div>
            <div className="text-xs text-slate-500 mt-1">
              {stats.progressToGoal.total.current} / 650
            </div>
          </div>
          
          <div className="text-center p-4 bg-emerald-900/30 rounded-xl border border-emerald-800">
            <div className="text-4xl font-bold text-emerald-400 mb-1">
              {stats.progressToGoal.operateur.current}
            </div>
            <div className="text-sm text-slate-400">Verantwortlich</div>
            <div className="text-xs text-slate-500 mt-1">
              Soll: 450 ({stats.progressToGoal.operateur.percent}%)
            </div>
          </div>
          
          <div className="text-center p-4 bg-amber-900/30 rounded-xl border border-amber-800">
            <div className="text-4xl font-bold text-amber-400 mb-1">
              {stats.progressToGoal.assistent.current}
            </div>
            <div className="text-sm text-slate-400">Assistent</div>
            <div className="text-xs text-slate-500 mt-1">
              Soll: 200 ({stats.progressToGoal.assistent.percent}%)
            </div>
          </div>
        </div>

        <ProgressBar 
          current={stats.progressToGoal.operateur.current}
          target={450}
          label="Verantwortlich (Soll 450)"
          color="bg-emerald-500"
        />
        <ProgressBar 
          current={stats.progressToGoal.assistent.current}
          target={200}
          label="Assistent (Soll 200)"
          color="bg-amber-500"
        />
      </div>

      {/* Detailed Teil & Gruppe Breakdown - SIWF Format - ALL ROWS SHOWN */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-cyan-400">
          Operationskatalog nach SIWF (vollständig)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Alle Teile und Gruppen • Format wie im eLogbuch PDF
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-700">
                <th className="pb-2 pl-2">Interventionen/Operationen</th>
                <th className="pb-2 text-right px-2">Max</th>
                <th className="pb-2 text-right px-2">V.Soll</th>
                <th className="pb-2 text-right px-2">V.Ist</th>
                <th className="pb-2 text-right px-2">A.Soll</th>
                <th className="pb-2 text-right px-2">A.Ist</th>
                <th className="pb-2 text-center px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Total Row */}
              <tr className="bg-slate-800/50 font-bold border-b border-slate-600">
                <td className="py-3 pl-2">Operationskatalog</td>
                <td className="py-3 text-right px-2 text-slate-400">-</td>
                <td className="py-3 text-right px-2 text-slate-400">450</td>
                <td className={`py-3 text-right px-2 ${stats.progressToGoal.operateur.current >= 450 ? 'text-emerald-400' : 'text-white'}`}>
                  {stats.progressToGoal.operateur.current}
                </td>
                <td className="py-3 text-right px-2 text-slate-400">200</td>
                <td className={`py-3 text-right px-2 ${stats.progressToGoal.assistent.current >= 200 ? 'text-emerald-400' : 'text-white'}`}>
                  {stats.progressToGoal.assistent.current}
                </td>
                <td className="py-3 text-center px-2">
                  {stats.progressToGoal.operateur.current >= 450 && stats.progressToGoal.assistent.current >= 200 ? '✅' : '⬜'}
                </td>
              </tr>
              
              {siwfCatalog.map(teil => {
                const teilData = stats.byTeil[teil.id] || { operateur: 0, assistent: 0 };
                const teilOperateurComplete = teilData.operateur >= teil.verantwortlichSoll;
                const teilAssistentComplete = teilData.assistent >= teil.assistentSoll;
                const gruppen = getAllGruppenFromTeil(teil);
                
                return (
                  <>
                    {/* Teil Row */}
                    <tr 
                      key={teil.id}
                      className="bg-purple-900/40 border-b border-slate-700 font-semibold"
                    >
                      <td className="py-2.5 pl-2">
                        {teil.name}
                      </td>
                      <td className="py-2.5 text-right px-2 text-purple-300">{teil.maximum}</td>
                      <td className="py-2.5 text-right px-2 text-purple-300">{teil.verantwortlichSoll}</td>
                      <td className={`py-2.5 text-right px-2 ${teilOperateurComplete ? 'text-emerald-400' : 'text-white'}`}>
                        {teilData.operateur}
                      </td>
                      <td className="py-2.5 text-right px-2 text-purple-300">{teil.assistentSoll}</td>
                      <td className={`py-2.5 text-right px-2 ${teilAssistentComplete ? 'text-emerald-400' : 'text-white'}`}>
                        {teilData.assistent}
                      </td>
                      <td className="py-2.5 text-center px-2">
                        {teilOperateurComplete && teilAssistentComplete ? '✅' : 
                         teilOperateurComplete || teilAssistentComplete ? '🟡' : '⬜'}
                      </td>
                    </tr>
                    
                    {/* Gruppe Rows - ALL SHOWN */}
                    {gruppen.map(gruppe => {
                      const gruppeData = stats.byGruppe[gruppe.id] || { operateur: 0, assistent: 0 };
                      const gruppeOperateurComplete = gruppe.verantwortlichSoll > 0 && gruppeData.operateur >= gruppe.verantwortlichSoll;
                      const gruppeAssistentComplete = gruppe.assistentSoll > 0 && gruppeData.assistent >= gruppe.assistentSoll;
                      
                      return (
                        <tr key={gruppe.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                          <td className="py-2 pl-6 text-slate-300">
                            <span className="text-slate-500 mr-2">G{gruppe.gruppeNum}</span>
                            {gruppe.name}
                          </td>
                          <td className="py-2 text-right px-2 text-slate-500">{gruppe.maximum}</td>
                          <td className="py-2 text-right px-2 text-slate-500">
                            {gruppe.verantwortlichSoll > 0 ? gruppe.verantwortlichSoll : '-'}
                          </td>
                          <td className={`py-2 text-right px-2 ${gruppeOperateurComplete ? 'text-emerald-400' : gruppeData.operateur > 0 ? 'text-white' : 'text-slate-600'}`}>
                            {gruppeData.operateur}
                          </td>
                          <td className="py-2 text-right px-2 text-slate-500">
                            {gruppe.assistentSoll > 0 ? gruppe.assistentSoll : '-'}
                          </td>
                          <td className={`py-2 text-right px-2 ${gruppeAssistentComplete ? 'text-emerald-400' : gruppeData.assistent > 0 ? 'text-white' : 'text-slate-600'}`}>
                            {gruppeData.assistent}
                          </td>
                          <td className="py-2 text-center px-2 text-xs">
                            {(gruppe.verantwortlichSoll > 0 || gruppe.assistentSoll > 0) ? (
                              gruppeOperateurComplete && gruppeAssistentComplete ? '✅' : 
                              gruppeOperateurComplete || gruppeAssistentComplete ? '🟡' : '⬜'
                            ) : ''}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* By Anatomical Region */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-cyan-400">Nach Anatomischer Region</h3>
        <p className="text-xs text-slate-500 mb-4">Nebenkriterium: Min. 175 Verantwortlich verteilt auf alle Regionen</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {anatomicalRegions.map(region => {
            const data = stats.byRegion[region.id] || { operateur: 0, assistent: 0 };
            const complete = data.operateur >= region.minimumOperateur;
            
            return (
              <div 
                key={region.id}
                className={`p-3 rounded-lg border ${
                  complete 
                    ? 'bg-emerald-900/20 border-emerald-700' 
                    : 'bg-slate-800 border-slate-700'
                }`}
              >
                <div className="text-sm font-medium text-white mb-1">
                  {region.nameShort}
                </div>
                <div className="text-xs text-slate-400">
                  V: {data.operateur} | A: {data.assistent}
                </div>
                <div className="text-xs text-slate-500">
                  Soll: {region.minimumOperateur}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sunburst Data Preview */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-cyan-400">Sunburst Übersicht</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-emerald-400 mb-2">Verantwortlich</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Teil 1 Prothetik</span>
                <span>{sunburst.operateur.prothetik}</span>
              </div>
              <div className="flex justify-between">
                <span>Teil 2 Osteotomien</span>
                <span>{sunburst.operateur.osteotomien}</span>
              </div>
              <div className="flex justify-between">
                <span>Teil 3 Rekonstruktiv</span>
                <span>{sunburst.operateur.rekonstruktiv}</span>
              </div>
              <div className="flex justify-between">
                <span>Teil 4 Osteosynthesen</span>
                <span>{sunburst.operateur.osteosynthesen}</span>
              </div>
              <div className="flex justify-between">
                <span>Teil 5 Diverses</span>
                <span>{sunburst.operateur.diverses}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-amber-400 mb-2">Assistent</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Teil 1 Prothetik</span>
                <span>{sunburst.assistent.prothetik}</span>
              </div>
              <div className="flex justify-between">
                <span>Teil 2 Osteotomien</span>
                <span>{sunburst.assistent.osteotomien}</span>
              </div>
              <div className="flex justify-between">
                <span>Teil 3 Rekonstruktiv</span>
                <span>{sunburst.assistent.rekonstruktiv}</span>
              </div>
              <div className="flex justify-between">
                <span>Teil 4 Osteosynthesen</span>
                <span>{sunburst.assistent.osteosynthesen}</span>
              </div>
              <div className="flex justify-between">
                <span>Teil 5 Diverses</span>
                <span>{sunburst.assistent.diverses}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-cyan-400">Übersicht</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{stats.totalOperations}</div>
            <div className="text-sm text-slate-400">Operationen</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{stats.totalProcedures}</div>
            <div className="text-sm text-slate-400">Prozeduren</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">{stats.byRole.operateur}</div>
            <div className="text-sm text-slate-400">als Verantwortlich</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400">{stats.byRole.assistent}</div>
            <div className="text-sm text-slate-400">als Assistent</div>
          </div>
        </div>
      </div>
    </div>
  );
}
