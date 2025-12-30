// Operation data types

export type Role = 'operateur' | 'assistent';

export interface ProcedureClassification {
  teilId: string;
  gruppeId: string;
  procedureId: string;
}

export interface Operation {
  // Auto-generated
  id: number;
  createdAt: string;
  updatedAt: string;
  
  // Patient info
  date: string; // Operation date
  patientId: string;
  patientName: string;
  patientDob: string;
  
  // Operation info
  diagnosis: string;
  operationRaw: string; // Full operation name from Epic
  operationShort: string; // Short description
  
  // Classification
  role: Role;
  anatomicalRegions: string[]; // Region IDs
  procedures: ProcedureClassification[]; // Can have multiple!
  implantTypes?: string[]; // For Osteosynthesen
  
  // Free text
  notes: string;
  
  // Epic data
  duration?: number; // Minutes
  surgeon?: string;
}

export interface OperationFormData {
  date: string;
  patientId: string;
  patientName: string;
  patientDob: string;
  diagnosis: string;
  operationRaw: string;
  operationShort: string;
  role: Role;
  anatomicalRegions: string[];
  procedures: ProcedureClassification[];
  implantTypes: string[];
  notes: string;
  duration?: number;
  surgeon?: string;
}

// Export formats
export interface ElogEntry {
  procedureName: string;
  role: string;
  date: string;
  region: string;
}

export interface SunburstEntry {
  role: Role;
  teil: string;
  count: number;
}

export interface ProCSVRow {
  id: number;
  date: string;
  patientId: string;
  patientName: string;
  patientDob: string;
  diagnosis: string;
  operationRaw: string;
  operationShort: string;
  role: Role;
  anatomicalRegions: string;
  teil: string;
  gruppe: string;
  procedure: string;
  implantTypes: string;
  notes: string;
  duration?: number;
  surgeon?: string;
}

