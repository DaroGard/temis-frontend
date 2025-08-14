export type InvoiceStatus = 'Pendiente' | 'Pagada' | 'Vencida';

export interface InvoiceItem {
  id?: number,
  description: string;
  hours_worked: number;
  hourly_rate: number;
}

export interface InvoiceSummary {
  id: number;
  invoice_number: number;
  client_name: string;
  emission_date: string;
  due_date: string;
  status: InvoiceStatus;
  amount?: number;
  total_amount: number;
  items?: InvoiceItem[];
  email?: string;
}

export interface InvoiceDetail {
  id: number;
  client: string;
  case_number: string;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  amount: number;
  items: InvoiceItem[];
}