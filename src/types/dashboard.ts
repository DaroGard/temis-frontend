// types/dashboard.ts
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  association_number: string;
  city: string;
  status: 'active' | 'inactive';
  role_id: number;
  account_id: number;
}

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
  priority_level: 'low' | 'medium' | 'high';
  notes: string;
  status: 'active' | 'pending' | 'closed';
  client?: Client;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  client_id: number;
  emission_date: string;
  due_date: string;
  issued_by_user_id: number;
  status: 'pending' | 'paid' | 'overdue';
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

export interface Agenda {
  id: number;
  event_name: string;
  description: string;
  due_date: string;
  tags: string;
  case_id?: number;
  legal_case_id?: number;
}

export interface DashboardMetrics {
  activeCases: number;
  pendingInvoices: number;
  todayAppointments: number;
  urgentTasks: number;
}

export interface RecentActivity {
  id: string;
  type: 'document' | 'invoice' | 'appointment';
  title: string;
  timestamp: string;
  icon: string;
  color: string;
}

export interface DashboardData {
  user: User;
  metrics: DashboardMetrics;
  recentCases: LegalCase[];
  recentInvoices: Invoice[];
  todayAgenda: Agenda[];
  recentActivity: RecentActivity[];
}