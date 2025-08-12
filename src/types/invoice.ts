export type InvoiceStatus = 'Pendiente' | 'Pagada' | 'Vencida';

export interface InvoiceItem {
  name: string;
  hours: number;
  rate: number;
}

export interface Invoice {
  id: number;
  client: string;
  caseNumber: string;
  amount: number | string;
  issueDate: string;
  dueDate: string;
  status: 'Pendiente' | 'Pagada' | 'Vencida';
  items: {
    name: string;
    hours: number;
    rate: number;
  }[];
}