export interface LegalCase {
  id: number;
  case_number: string;
  title: string;
  start_date: string;
  end_date?: string;
  case_type: string;
  account_id: number;
  client_id: number;
  description: string;
  priority_level: 'baja' | 'media' | 'alta';
  notes: string;
  status: 'activo' | 'pendiente' | 'urgente' | 'cerrado';
  client?: Client;
}

export interface Client {
  id: number;
  dni: string;
  name: string;
  email: string;
  phone_1: string;
  phone_2?: string;
  address: string;
}

export interface CasesMetrics {
  total: number;
  active: number;
  urgent: number;
  pending: number;
}