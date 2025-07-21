export type InvoiceStatus = 'Pendiente' | 'Pagada' | 'Vencida';

export interface Invoice {
  id: number;
  client: string;
  caseNumber: string;
  amount: string;
  status: InvoiceStatus;
  dueDate: string;
}
