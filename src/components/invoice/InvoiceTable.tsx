import React, { useState, useCallback, Suspense, memo } from 'react';
import { Eye, Download } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import type { Invoice } from '~/types/invoice';
import { StatusBadge } from './StatusBadge';
import { InvoiceActionsMenu } from './InvoiceActionsMenu';

const InvoiceModal = React.lazy(() =>
  import('./InvoiceModal').then((m) => ({ default: m.InvoiceModal }))
);

const formatCurrency = (value: number) =>
  value.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? dateStr
    : d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
};

const InvoiceRow = memo(
  ({
    inv,
    onSelect,
    onDownloadPdf,
    onEdit,
    onDelete,
    onSendEmail,
    onDuplicate,
    onMarkPaid,
    onViewHistory,
  }: {
    inv: Invoice;
    onSelect: (inv: Invoice) => void;
    onDownloadPdf: (inv: Invoice) => void;
    onEdit: (inv: Invoice) => void;
    onDelete: (inv: Invoice) => void;
    onSendEmail: (inv: Invoice) => void;
    onDuplicate: (inv: Invoice) => void;
    onMarkPaid: (inv: Invoice) => void;
    onViewHistory: (inv: Invoice) => void;
  }) => {
    const total = inv.items?.reduce((acc, item) => acc + (item.hours * item.rate), 0) ?? 0;

    return (
      <tr
        key={inv.id}
        className="border-t border-gray-100 hover:bg-blue-50 transition-colors duration-150 focus-within:bg-blue-100"
        tabIndex={0}
        aria-label={`Factura número ${inv.id} para cliente ${inv.client}`}
        onKeyDown={(e) => e.key === 'Enter' && onSelect(inv)}
      >
        <td className="px-5 py-4 font-semibold">{inv.id}</td>
        <td className="px-5 py-4">{inv.client}</td>
        <td className="px-5 py-4">{inv.caseNumber}</td>
        <td className="px-5 py-4">{formatCurrency(total)}</td>
        <td className="px-5 py-4">
          <StatusBadge status={inv.status} />
        </td>
        <td className="px-5 py-4">{formatDate(inv.dueDate)}</td>
        <td className="px-5 py-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onSelect(inv)}
              className="inline-flex items-center gap-1 text-sm text-links hover:underline transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-links rounded"
              aria-label={`Ver detalles de factura #${inv.id}`}
            >
              <Eye size={16} aria-hidden="true" /> Ver
            </button>

            <button
              type="button"
              onClick={() => onDownloadPdf(inv)}
              className="p-1 text-gray-500 hover:text-gray-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400 rounded"
              aria-label={`Descargar factura #${inv.id} en PDF`}
            >
              <Download size={18} aria-hidden="true" />
            </button>

            <InvoiceActionsMenu
              invoice={inv}
              onEdit={onEdit}
              onDelete={onDelete}
              onSendEmail={onSendEmail}
              onMarkPaid={onMarkPaid}
            />
          </div>
        </td>
      </tr>
    );
  }
);

interface Props {
  invoices: Invoice[];
  onEdit: (updatedInvoice: Invoice) => void;
  onDelete: (inv: Invoice) => void;
  onSendEmail: (inv: Invoice) => void;
  onMarkPaid: (updatedInvoice: Invoice) => void;
}

const InvoiceTable: React.FC<Props> = ({
  invoices,
  onEdit,
  onDelete,
  onSendEmail,
  onMarkPaid,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleSelect = useCallback((inv: Invoice) => {
    setSelectedInvoice(inv);
  }, []);

  const handleDownloadPdf = useCallback(async (invoice: Invoice) => {
    try {
      const { default: InvoiceDocument } = await import('./InvoiceDocument').then((m) => ({
        default: m.InvoiceDocument,
      }));
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

  const handleEdit = useCallback((inv: Invoice) => {
    console.log('Editar', inv);
  }, []);

  const handleDelete = useCallback((inv: Invoice) => {
    if (window.confirm(`¿Seguro que quieres eliminar la factura #${inv.id}?`)) {
      console.log('Eliminar', inv);
    }
  }, []);

  const handleSendEmail = useCallback((inv: Invoice) => {
    console.log('Enviar por correo', inv);
  }, []);

  const handleDuplicate = useCallback((inv: Invoice) => {
    console.log('Duplicar', inv);
  }, []);

  const handleMarkPaid = useCallback((inv: Invoice) => {
    console.log('Marcar como pagada', inv);
  }, []);

  const handleViewHistory = useCallback((inv: Invoice) => {
    console.log('Ver historial', inv);
  }, []);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto transition-all">
        <table className="min-w-full table-auto text-sm text-gray-800">
          <thead>
            <tr className="bg-gray-100 text-xs uppercase tracking-wide text-gray-600 select-none">
              <th className="px-5 py-3 text-left font-semibold">N°</th>
              <th className="px-5 py-3 text-left font-semibold">Cliente</th>
              <th className="px-5 py-3 text-left font-semibold">Caso</th>
              <th className="px-5 py-3 text-left font-semibold">Valor</th>
              <th className="px-5 py-3 text-left font-semibold">Estado</th>
              <th className="px-5 py-3 text-left font-semibold">Vencimiento</th>
              <th className="px-5 py-3 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <InvoiceRow
                key={inv.id}
                inv={inv}
                onSelect={handleSelect}
                onDownloadPdf={handleDownloadPdf}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSendEmail={handleSendEmail}
                onDuplicate={handleDuplicate}
                onMarkPaid={handleMarkPaid}
                onViewHistory={handleViewHistory}
              />
            ))}
          </tbody>
        </table>
      </div>

      {selectedInvoice && (
        <Suspense fallback={<div className="p-4 text-center text-sm text-gray-500">Cargando factura...</div>}>
          <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
        </Suspense>
      )}
    </>
  );
};

export default InvoiceTable;