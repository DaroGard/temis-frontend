// src/types/cases.ts - Tipos basados en tus schemas del backend

// Enums del backend
export type CaseType = 
  | 'CIVIL' 
  | 'PENAL' 
  | 'LABORAL' 
  | 'CONTENCIOSO_ADMINISTRATIVO'
  | 'MERCANTIL'
  | 'RECLAMOS_MENORES'
  | 'FAMILIA'
  | 'ADMINISTRATIVO'
  | 'FISCAL'
  | 'CONSTITUCIONAL'
  | 'AMBIENTAL'
  | 'INTERNACIONAL';

export type PriorityLevel = 'NORMAL' | 'MID' | 'HIGH';
export type CaseStatus = 'VICTORIA' | 'DERROTA' | 'ACTIVO' | 'CONCILIACION';

// Cliente (basado en ClientOut schema)
export interface Client {
  id: number;
  first_name: string;
  last_name: string;
  phone_1: string;
  phone_2?: string;
  email: string;
  dni: string;
  address: string;
}

// Caso legal completo (basado en LegalCaseOut schema)
export interface LegalCaseOut {
  id: number;
  start_date: string; // ISO datetime string
  case_type: string;
  client: Client;
  description: string;
  notes: string;
  title: string;
  case_number?: string;
  end_date?: string;
  priority_level: string;
  status: string;
}

// Para crear nuevo caso (basado en NewCaseData schema)
export interface NewCaseData {
  title: string;
  start_date: string; // ISO datetime
  case_type: CaseType;
  plaintiff: string;
  defendant: string;
  description?: string;
  notes?: string;
  client_id?: number;
  client?: {
    first_name: string;
    last_name: string;
    phone_1: string;
    email: string;
    dni: string;
    addresss: string; // Nota: hay un typo en el backend "addresss"
  };
}

// Summary para listas (basado en LegalCaseSummaryResponse)
export interface LegalCaseSummaryItem {
  id: number;
  title: string;
  case_number: string;
  case_type: string;
  status: string;
  client_name: string;
  start_date: string;
}

export interface LegalCaseSummaryResponse {
  cases: LegalCaseSummaryItem[];
  total_count: number;
}

// Para actualizar notas (basado en LegalCaseNotesUpdate)
export interface LegalCaseNotesUpdate {
  id: number;
  notes: string;
}

// Métricas del dashboard
export interface CasesMetrics {
  total: number;
  active: number;
  urgent: number;
  pending: number;
}

// Archivo (basado en FileOut schema)
export interface CaseFile {
  id: number;
  upload_date: string; // ISO datetime
  file_name: string;
  size_mb: number;
}

// Para compatibilidad con tu código actual

export interface LegalCase {
  id: number;
  title: string;
  case_number: string;
  case_type: string;
  start_date: string;
  end_date?: string;
  status: 'activo' | 'victoria' | 'derrota' | 'conciliacion';
  priority_level: 'alta' | 'media' | 'baja';
  description: string;
  notes: string;
  client?: {
    id: number;
    name: string;
    dni: string;
    email: string;
    phone_1: string;
    phone_2?: string;
    address: string;
  };
  account_id: number;
  client_id: number;
}

// Tipos para formularios
export interface CreateCaseFormData {
  title: string;
  caseNumber: string;
  startDate: string;
  caseType: string;
  priority: string;
  description: string;
  notes?: string;
  // Cliente nuevo
  clientFirstName: string;
  clientLastName: string;
  clientDni: string;
  clientPhone: string;
  clientPhoneAlt?: string;
  clientEmail: string;
  clientAddress?: string;
  clientGender?: string;
  // Agenda
  firstMeeting?: string;}