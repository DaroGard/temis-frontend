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
  client_email: string;
  emission_date: string;
  due_date: string;
  status: InvoiceStatus;
  amount?: number;
  total_amount: number;
  items?: InvoiceItem[];
}