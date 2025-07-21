import React from 'react';
import type { InvoiceStatus } from '~/types/invoice';

interface Props {
  status: InvoiceStatus;
}

const statusStyles: Record<InvoiceStatus, string> = {
  Pendiente: 'bg-yellow-100 text-yellow-800',
  Pagada: 'bg-green-100 text-green-800',
  Vencida: 'bg-red-100 text-red-800',
};

export const StatusBadge: React.FC<Props> = ({ status }) => {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};
