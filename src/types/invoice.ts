export type InvoiceStatus = 'Pendiente' | 'Pagada' | 'Vencida';

export interface InvoiceItem {
  name: string;
  hours: number;
  rate: number;
}

export interface Invoice {
  client: any;
  id: number;
  client_id: number;         
  client_name?: string;     
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