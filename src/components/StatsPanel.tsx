import { useMemo } from 'react';
import type { Operation } from '../types/Operation';
import { generateDetailedStats, generateSunburstSummary } from '../utils/exports';
import { siwfCatalog, anatomicalRegions } from '../data/siwfCatalog';

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

      {/* By Teil */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-cyan-400">Nach Kategorie (Teil)</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-700">
                <th className="pb-2">Teil</th>
                <th className="pb-2 text-right">Verantw. Ist</th>
                <th className="pb-2 text-right">Verantw. Soll</th>
                <th className="pb-2 text-right">Assist. Ist</th>
                <th className="pb-2 text-right">Assist. Soll</th>
                <th className="pb-2 text-right">Max</th>
                <th className="pb-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {siwfCatalog.map(teil => {
                const data = stats.byTeil[teil.id];
                const operateurComplete = data.operateur >= teil.verantwortlichSoll;
                const assistentComplete = data.assistent >= teil.assistentSoll;
                
                return (
                  <tr key={teil.id} className="border-b border-slate-800">
                    <td className="py-2 font-medium">Teil {teil.teilNum}</td>
                    <td className={`py-2 text-right ${operateurComplete ? 'text-emerald-400' : 'text-white'}`}>
                      {data.operateur}
                    </td>
                    <td className="py-2 text-right text-slate-500">
                      {teil.verantwortlichSoll}
                    </td>
                    <td className={`py-2 text-right ${assistentComplete ? 'text-emerald-400' : 'text-white'}`}>
                      {data.assistent}
                    </td>
                    <td className="py-2 text-right text-slate-500">
                      {teil.assistentSoll}
                    </td>
                    <td className="py-2 text-right text-slate-500">{teil.maximum}</td>
                    <td className="py-2 text-center">
                      {operateurComplete && assistentComplete ? '✅' : 
                       operateurComplete || assistentComplete ? '🟡' : '⬜'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Teil names legend */}
        <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-500 grid grid-cols-1 md:grid-cols-2 gap-1">
          {siwfCatalog.map(teil => (
            <div key={teil.id}>
              <span className="text-slate-400">Teil {teil.teilNum}:</span> {teil.name.replace(/^Teil \d+ /, '')}
            </div>
          ))}
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
                <span>T1 Prothetik</span>
                <span>{sunburst.operateur.prothetik}</span>
              </div>
              <div className="flex justify-between">
                <span>T2 Osteotomien</span>
                <span>{sunburst.operateur.osteotomien}</span>
              </div>
              <div className="flex justify-between">
                <span>T3 Rekonstruktiv</span>
                <span>{sunburst.operateur.rekonstruktiv}</span>
              </div>
              <div className="flex justify-between">
                <span>T4 Osteosynthesen</span>
                <span>{sunburst.operateur.osteosynthesen}</span>
              </div>
              <div className="flex justify-between">
                <span>T5 Diverses</span>
                <span>{sunburst.operateur.diverses}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-amber-400 mb-2">Assistent</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>T1 Prothetik</span>
                <span>{sunburst.assistent.prothetik}</span>
              </div>
              <div className="flex justify-between">
                <span>T2 Osteotomien</span>
                <span>{sunburst.assistent.osteotomien}</span>
              </div>
              <div className="flex justify-between">
                <span>T3 Rekonstruktiv</span>
                <span>{sunburst.assistent.rekonstruktiv}</span>
              </div>
              <div className="flex justify-between">
                <span>T4 Osteosynthesen</span>
                <span>{sunburst.assistent.osteosynthesen}</span>
              </div>
              <div className="flex justify-between">
                <span>T5 Diverses</span>
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
