import type { Operation, ProCSVRow } from '../types/Operation';
import { getProcedureById, getRegionById, siwfCatalog } from '../data/siwfCatalog';

// Generate Pro CSV for analysis - includes Teil# and Gruppe# for easy sorting
export function generateProCSV(operations: Operation[]): string {
  const rows: ProCSVRow[] = [];
  
  for (const op of operations) {
    // One row per procedure classification
    for (const proc of op.procedures) {
      const procInfo = getProcedureById(proc.procedureId);
      if (!procInfo) continue;
      
      // Build region string with codes
      const regionStrs = op.anatomicalRegions.map(r => {
        const region = getRegionById(r);
        return region ? region.nameShort : r;
      });
      
      rows.push({
        id: op.id,
        date: op.date,
        patientId: op.patientId,
        patientName: op.patientName,
        patientDob: op.patientDob,
        diagnosis: op.diagnosis,
        operationRaw: op.operationRaw,
        operationShort: op.operationShort,
        role: op.role,
        anatomicalRegions: regionStrs.join('; '),
        // Include Teil number for sorting (e.g., "1" for Teil 1)
        teilNum: procInfo.teil.teilNum,
        teil: procInfo.teil.name,
        // Include Gruppe number for sorting (e.g., "2" for Gruppe 2)
        gruppeNum: procInfo.gruppe.gruppeNum,
        gruppe: procInfo.gruppe.name,
        procedure: procInfo.procedure.name,  // Full name from eLogbuch
        implantTypes: (op.implantTypes || []).join('; '),
        notes: op.notes,
        duration: op.duration,
        surgeon: op.surgeon,
      });
    }
  }
  
  // CSV header - includes TeilNum and GruppeNum for sorting
  const headers = [
    'ID', 'Datum', 'Patient_ID', 'Patient_Name', 'Geburtsdatum',
    'Diagnose', 'Operation_Roh', 'Operation_Kurz', 'Rolle',
    'Anatomische_Regionen', 
    'Teil_Num', 'Teil', 'Gruppe_Num', 'Gruppe', 'Prozedur',
    'Implantat_Typen', 'Notizen', 'Dauer_Min', 'Chirurg'
  ];
  
  const csvRows = rows.map(row => [
    row.id,
    row.date,
    `"${row.patientId}"`,
    `"${row.patientName}"`,
    row.patientDob,
    `"${row.diagnosis.replace(/"/g, '""')}"`,
    `"${row.operationRaw.replace(/"/g, '""')}"`,
    `"${row.operationShort.replace(/"/g, '""')}"`,
    row.role,
    `"${row.anatomicalRegions}"`,
    row.teilNum,  // Numeric for sorting
    `"${row.teil}"`,
    row.gruppeNum,  // Numeric for sorting
    `"${row.gruppe}"`,
    `"${row.procedure.replace(/"/g, '""')}"`,
    `"${row.implantTypes}"`,
    `"${row.notes.replace(/"/g, '""')}"`,
    row.duration || '',
    `"${row.surgeon || ''}"`,
  ].join(','));
  
  return [headers.join(','), ...csvRows].join('\n');
}

// Generate eLogbook format for copy-paste
export function generateElogFormat(operations: Operation[]): string {
  const lines: string[] = [];
  
  for (const op of operations) {
    const roleGerman = op.role === 'operateur' ? 'Verantwortlich' : 'Assistent';
    const regions = op.anatomicalRegions
      .map(r => getRegionById(r)?.name || r)
      .join(', ');
    
    for (const proc of op.procedures) {
      const procInfo = getProcedureById(proc.procedureId);
      if (!procInfo) continue;
      
      lines.push(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Datum: ${op.date}
Patient: ${op.patientName} (${op.patientId})
Diagnose: ${op.diagnosis}
Operation: ${op.operationShort}
──────────────────────────────────────────────
Teil ${procInfo.teil.teilNum}: ${procInfo.teil.name}
${procInfo.gruppe.name}
Prozedur: ${procInfo.procedure.name}
Rolle: ${roleGerman}
Region: ${regions}
${op.notes ? `Notizen: ${op.notes}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    }
  }
  
  return lines.join('\n\n');
}

// Generate Sunburst summary counts
export interface SunburstSummary {
  operateur: {
    prothetik: number;
    osteotomien: number;
    rekonstruktiv: number;
    osteosynthesen: number;
    diverses: number;
  };
  assistent: {
    prothetik: number;
    osteotomien: number;
    rekonstruktiv: number;
    osteosynthesen: number;
    diverses: number;
  };
  byProcedure: Record<string, { operateur: number; assistent: number }>;
}

export function generateSunburstSummary(operations: Operation[]): SunburstSummary {
  const summary: SunburstSummary = {
    operateur: { prothetik: 0, osteotomien: 0, rekonstruktiv: 0, osteosynthesen: 0, diverses: 0 },
    assistent: { prothetik: 0, osteotomien: 0, rekonstruktiv: 0, osteosynthesen: 0, diverses: 0 },
    byProcedure: {},
  };
  
  const teilMap: Record<string, keyof typeof summary.operateur> = {
    'teil1': 'prothetik',
    'teil2': 'osteotomien',
    'teil3': 'rekonstruktiv',
    'teil4': 'osteosynthesen',
    'teil5': 'diverses',
  };
  
  for (const op of operations) {
    for (const proc of op.procedures) {
      const kategorie = teilMap[proc.teilId];
      if (kategorie) {
        summary[op.role][kategorie]++;
      }
      
      // Track by procedure
      if (!summary.byProcedure[proc.procedureId]) {
        summary.byProcedure[proc.procedureId] = { operateur: 0, assistent: 0 };
      }
      summary.byProcedure[proc.procedureId][op.role]++;
    }
  }
  
  return summary;
}

// Generate detailed stats for dashboard matching eLogbuch structure
export interface DetailedStats {
  totalOperations: number;
  totalProcedures: number;
  byRole: { operateur: number; assistent: number };
  byTeil: Record<string, { 
    teilNum: number;
    name: string;
    operateur: number; 
    assistent: number; 
    verantwortlichSoll: number; 
    assistentSoll: number;
    maximum: number;
  }>;
  byGruppe: Record<string, { 
    gruppeNum: number;
    name: string;
    teilId: string;
    operateur: number; 
    assistent: number; 
    verantwortlichSoll: number;
    assistentSoll: number;
    maximum: number;
  }>;
  byRegion: Record<string, { operateur: number; assistent: number; minimum: number }>;
  progressToGoal: {
    operateur: { current: number; required: number; percent: number };
    assistent: { current: number; required: number; percent: number };
    total: { current: number; required: number; percent: number };
  };
}

export function generateDetailedStats(operations: Operation[]): DetailedStats {
  const stats: DetailedStats = {
    totalOperations: operations.length,
    totalProcedures: 0,
    byRole: { operateur: 0, assistent: 0 },
    byTeil: {},
    byGruppe: {},
    byRegion: {},
    progressToGoal: {
      operateur: { current: 0, required: 450, percent: 0 },
      assistent: { current: 0, required: 200, percent: 0 },
      total: { current: 0, required: 650, percent: 0 },
    },
  };
  
  // Initialize Teil stats from catalog
  for (const teil of siwfCatalog) {
    stats.byTeil[teil.id] = {
      teilNum: teil.teilNum,
      name: teil.name,
      operateur: 0,
      assistent: 0,
      verantwortlichSoll: teil.verantwortlichSoll,
      assistentSoll: teil.assistentSoll,
      maximum: teil.maximum,
    };
    
    // Initialize Gruppe stats (including from subKategorien for Teil 4)
    for (const gruppe of teil.gruppen) {
      stats.byGruppe[gruppe.id] = {
        gruppeNum: gruppe.gruppeNum,
        name: gruppe.name,
        teilId: teil.id,
        operateur: 0,
        assistent: 0,
        verantwortlichSoll: gruppe.verantwortlichSoll,
        assistentSoll: gruppe.assistentSoll,
        maximum: gruppe.maximum,
      };
    }
    
    // Teil 4 has subKategorien with gruppen inside
    if (teil.subKategorien) {
      for (const sub of teil.subKategorien) {
        for (const gruppe of sub.gruppen) {
          stats.byGruppe[gruppe.id] = {
            gruppeNum: gruppe.gruppeNum,
            name: gruppe.name,
            teilId: teil.id,
            operateur: 0,
            assistent: 0,
            verantwortlichSoll: gruppe.verantwortlichSoll,
            assistentSoll: gruppe.assistentSoll,
            maximum: gruppe.maximum,
          };
        }
      }
    }
  }
  
  // Count operations
  for (const op of operations) {
    stats.byRole[op.role]++;
    
    for (const proc of op.procedures) {
      stats.totalProcedures++;
      
      if (stats.byTeil[proc.teilId]) {
        stats.byTeil[proc.teilId][op.role]++;
      }
      if (stats.byGruppe[proc.gruppeId]) {
        stats.byGruppe[proc.gruppeId][op.role]++;
      }
    }
    
    for (const regionId of op.anatomicalRegions) {
      if (!stats.byRegion[regionId]) {
        const region = getRegionById(regionId);
        stats.byRegion[regionId] = {
          operateur: 0,
          assistent: 0,
          minimum: region?.minimumOperateur || 0,
        };
      }
      stats.byRegion[regionId][op.role]++;
    }
  }
  
  // Calculate progress using SIWF counting rules
  let countableOperateur = 0;
  let countableAssistent = 0;
  
  for (const teil of siwfCatalog) {
    const teilStats = stats.byTeil[teil.id];
    // Count up to maximum for each Teil
    countableOperateur += Math.min(teilStats.operateur, teil.maximum);
    countableAssistent += Math.min(teilStats.assistent, teil.assistentSoll);
  }
  
  stats.progressToGoal.operateur.current = countableOperateur;
  stats.progressToGoal.operateur.percent = Math.round((countableOperateur / 450) * 100);
  
  stats.progressToGoal.assistent.current = countableAssistent;
  stats.progressToGoal.assistent.percent = Math.round((countableAssistent / 200) * 100);
  
  stats.progressToGoal.total.current = countableOperateur + countableAssistent;
  stats.progressToGoal.total.percent = Math.round(((countableOperateur + countableAssistent) / 650) * 100);
  
  return stats;
}

// Download helper
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
