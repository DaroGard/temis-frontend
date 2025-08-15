export interface DashboardMetrics {
  active_cases: number;
  pending_invoices: number;
  today_appointments: number;
  urgent_tasks: number;
}

export interface DashboardCase {
  id: number;
  title: string;
  case_number: string;
  case_type: string;
  status: string;
  client_name: string;
  start_date: string;
}

export interface DashboardInvoice {
  id: number;
  invoice_number: number;
  client_name: string;
  total_amount: number;
  status: string;
  emission_date: string;
  due_date: string;
}

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_name: string;
  subscription_plan: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}