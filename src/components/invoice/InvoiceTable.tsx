import React, { useState, useCallback } from 'react';
import { Eye, Download } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import type { Invoice } from '~/types/invoice';
import { StatusBadge } from './StatusBadge';
import { InvoiceModal } from './InvoiceModal';
import { InvoiceDocument } from './InvoiceDocument';
import { InvoiceActionsMenu } from './InvoiceActionsMenu';

interface Props {
  invoices: Invoice[];
}

const formatCurrency = (value: number) =>
  value.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const InvoiceTable: React.FC<Props> = ({ invoices }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleDownloadPdf = useCallback(async (invoice: Invoice) => {
    try {
      const blob = await pdf(<InvoiceDocument invoice={invoice} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Factura_${invoice.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Ocurrió un error al generar el PDF.');
    }
  }, []);

  const handleEdit = useCallback((invoice: Invoice) => {
    console.log('Editar', invoice);
  }, []);
  const handleDelete = useCallback((invoice: Invoice) => {
    if (window.confirm(`¿Seguro que quieres eliminar la factura #${invoice.id}?`)) {
      console.log('Eliminar', invoice);
    }
  }, []);
  const handleSendEmail = useCallback((invoice: Invoice) => {
    console.log('Enviar por correo', invoice);
  }, []);
  const handleDuplicate = useCallback((invoice: Invoice) => {
    console.log('Duplicar', invoice);
  }, []);
  const handleMarkPaid = useCallback((invoice: Invoice) => {
    console.log('Marcar como pagada', invoice);
  }, []);
  const handleViewHistory = useCallback((invoice: Invoice) => {
    console.log('Ver historial', invoice);
  }, []);

  return (
    <>
      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-50 uppercase text-xs text-gray-600 select-none">
              <th className="px-5 py-3 text-left font-semibold tracking-wide">N°</th>
              <th className="px-5 py-3 text-left font-semibold tracking-wide">Cliente</th>
              <th className="px-5 py-3 text-left font-semibold tracking-wide">Caso</th>
              <th className="px-5 py-3 text-left font-semibold tracking-wide">Valor</th>
              <th className="px-5 py-3 text-left font-semibold tracking-wide">Estado</th>
              <th className="px-5 py-3 text-left font-semibold tracking-wide">Vencimiento</th>
              <th className="px-5 py-3 text-center font-semibold tracking-wide">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr
                key={inv.id}
                className="border-t border-gray-100 hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                tabIndex={0}
                aria-label={`Factura número ${inv.id} para cliente ${inv.client}`}
                onKeyDown={e => {
                  if (e.key === 'Enter') setSelectedInvoice(inv);
                }}
              >
                <td className="px-5 py-4 font-medium">{inv.id}</td>
                <td className="px-5 py-4">{inv.client}</td>
                <td className="px-5 py-4">{inv.caseNumber}</td>
                <td className="px-5 py-4">{formatCurrency(Number(inv.amount) || 0)}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={inv.status} />
                </td>
                <td className="px-5 py-4">{formatDate(inv.dueDate)}</td>
                <td className="px-5 py-4 text-center flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(inv)}
                    className="text-[var(--links-color)] hover:underline flex items-center gap-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--links-color)] rounded"
                    aria-label={`Ver detalles de factura #${inv.id}`}
                  >
                    <Eye size={16} aria-hidden="true" /> Ver
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadPdf(inv)}
                    className="text-gray-500 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-500 rounded p-1"
                    aria-label={`Descargar factura #${inv.id} en PDF`}
                  >
                    <Download size={18} aria-hidden="true" />
                  </button>

                  <InvoiceActionsMenu
                    invoice={inv}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSendEmail={handleSendEmail}
                    onDuplicate={handleDuplicate}
                    onMarkPaid={handleMarkPaid}
                    onViewHistory={handleViewHistory}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </>
  );
};