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
    // TODO: lógica editar 
  }, []);

  const handleDelete = useCallback((invoice: Invoice) => {
    if (window.confirm(`¿Seguro que quieres eliminar la factura #${invoice.id}?`)) {
      console.log('Eliminar', invoice);
      // TODO:  lógica eliminar 
    }
  }, []);

  const handleSendEmail = useCallback((invoice: Invoice) => {
    console.log('Enviar por correo', invoice);
    // TODO:  lógica enviar email
  }, []);

  const handleDuplicate = useCallback((invoice: Invoice) => {
    console.log('Duplicar', invoice);
    // TODO:  lógica duplicar 
  }, []);

  const handleMarkPaid = useCallback((invoice: Invoice) => {
    console.log('Marcar como pagada', invoice);
    // TODO:  lógica marcar pagada
  }, []);

  const handleViewHistory = useCallback((invoice: Invoice) => {
    console.log('Ver historial', invoice);
    // TODO:  lógica ver historial
  }, []);

  return (
    <>
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
            {invoices.map((inv) => (
              <tr
                key={inv.id}
                className="border-t hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-4 py-3 font-medium">{inv.id}</td>
                <td className="px-4 py-3">{inv.client}</td>
                <td className="px-4 py-3">{inv.caseNumber}</td>
                <td className="px-4 py-3">{(Number(inv.amount) || 0).toFixed(2)} US$</td>
                <td className="px-4 py-3">
                  <StatusBadge status={inv.status} />
                </td>
                <td className="px-4 py-3">{inv.dueDate}</td>
                <td className="px-4 py-3 text-center flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(inv)}
                    className="text-[var(--links-color)] hover:underline flex items-center gap-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--links-color)]"
                    aria-label={`Ver detalles de factura #${inv.id}`}
                  >
                    <Eye size={16} /> Ver Factura
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadPdf(inv)}
                    className="cursor-pointer text-gray-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500 rounded"
                    aria-label={`Descargar factura #${inv.id} en PDF`}
                  >
                    <Download size={16} />
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
