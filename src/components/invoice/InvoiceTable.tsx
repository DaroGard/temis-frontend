import React from 'react';
import { Eye, Download, MoreVertical } from 'lucide-react';
import type { Invoice } from '~/types/invoice';
import { StatusBadge } from './StatusBadge';

interface Props {
  invoices: Invoice[];
}

export const InvoiceTable: React.FC<Props> = ({ invoices }) => {
  return (
    <div className="bg-white rounded-lg shadow border overflow-x-auto">
      <table className="min-w-full table-auto text-sm text-gray-700">
        <thead>
          <tr className="bg-gray-100 uppercase text-xs text-gray-600">
            <th className="px-4 py-3 text-left">N°</th>
            <th className="px-4 py-3 text-left">Cliente</th>
            <th className="px-4 py-3 text-left">Caso</th>
            <th className="px-4 py-3 text-left">Valor</th>
            <th className="px-4 py-3 text-left">Estado</th>
            <th className="px-4 py-3 text-left">Vencimiento</th>
            <th className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv, idx) => (
            <tr
              key={inv.id}
              className="border-t hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-4 py-3 font-medium">{inv.id}</td>
              <td className="px-4 py-3">{inv.client}</td>
              <td className="px-4 py-3">{inv.caseNumber}</td>
              <td className="px-4 py-3">{inv.amount}</td>
              <td className="px-4 py-3">
                <StatusBadge status={inv.status} />
              </td>
              <td className="px-4 py-3">{inv.dueDate}</td>
              <td className="px-4 py-3 text-center flex items-center justify-center gap-3">
                <button className="text-[var(--links-color)] hover:underline flex items-center gap-1 text-sm">
                  <Eye size={16} /> Ver Factura
                </button>
                <Download size={16} className="cursor-pointer text-gray-500 hover:text-black" />
                <MoreVertical size={16} className="cursor-pointer text-gray-500 hover:text-black" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
