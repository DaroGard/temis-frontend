import React, { useState, useCallback, Suspense, memo } from 'react';
import { Eye, Download } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import toast from 'react-hot-toast';
import type { InvoiceSummary } from '~/types/invoice';
import { StatusBadge } from './StatusBadge';
import { InvoiceActionsMenu } from './InvoiceActionsMenu';

const InvoiceModal = React.lazy(() =>
  import('./InvoiceModal').then((m) => ({ default: m.InvoiceModal }))
);

// Funciones de formateo
const formatCurrency = (value: number) =>
  value.toLocaleString('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? dateStr
    : d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Fila individual de factura
const InvoiceRow = memo(
  ({
    inv,
    onSelect,
    onDownloadPdf,
    onEdit,
    onDelete,
    onSendEmail,
    onMarkPaid,
  }: {
    inv: InvoiceSummary;
    onSelect: (inv: InvoiceSummary) => void;
    onDownloadPdf: (inv: InvoiceSummary) => void;
    onEdit: (inv: InvoiceSummary) => void;
    onDelete: (inv: InvoiceSummary) => void;
    onSendEmail: (inv: InvoiceSummary) => void;
    onMarkPaid: (inv: InvoiceSummary) => void;
  }) => {
    const total = inv.total_amount ?? 0;

    return (
      <tr
        role="row"
        tabIndex={0}
        className="border-t border-gray-100 hover:bg-blue-50 focus-within:bg-blue-100 transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-links"
        aria-label={`Factura #${inv.invoice_number}, cliente ${inv.client_name}, total ${formatCurrency(total)}`}
        onKeyDown={(e) => e.key === 'Enter' && onSelect(inv)}
      >
        <td className="px-5 py-4 font-semibold">{inv.invoice_number}</td>
        <td className="px-5 py-4">{inv.client_name}</td>
        <td className="px-5 py-4">{inv.id}</td>
        <td className="px-5 py-4">{formatCurrency(total)}</td>
        <td className="px-5 py-4"><StatusBadge status={inv.status} /></td>
        <td className="px-5 py-4">{formatDate(inv.due_date)}</td>
        <td className="px-5 py-4 text-center">
          <div className="flex items-center justify-center gap-3">
            {/* Ver detalles */}
            <button
              type="button"
              onClick={() => onSelect(inv)}
              className="inline-flex items-center gap-1 text-sm text-links hover:underline transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-links rounded"
              aria-label={`Ver detalles de factura #${inv.invoice_number}`}
            >
              <Eye size={16} aria-hidden="true" /> Ver
            </button>

            {/* Descargar PDF */}
            <button
              type="button"
              onClick={() => onDownloadPdf(inv)}
              className="p-1 text-gray-500 hover:text-gray-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400 rounded"
              aria-label={`Descargar factura #${inv.invoice_number} en PDF`}
            >
              <Download size={18} aria-hidden="true" />
            </button>

            {/* Menú de acciones */}
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

// Tabla de facturas
interface InvoiceTableProps {
  invoices: InvoiceSummary[];
  onEdit: (inv: InvoiceSummary) => void;
  onDelete: (inv: InvoiceSummary) => void;
  onSendEmail: (inv: InvoiceSummary) => void;
  onMarkPaid: (inv: InvoiceSummary) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  onEdit,
  onDelete,
  onSendEmail,
  onMarkPaid,
}) => {
  // Estado del modal
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceSummary | null>(null);


  // Handlers de acciones
  const handleSelect = useCallback((inv: InvoiceSummary) => setSelectedInvoice(inv), []);

  const handleDownloadPdf = useCallback(async (invoice: InvoiceSummary) => {
    try {
      const { default: InvoiceDocument } = await import('./InvoiceDocument').then(m => ({ default: m.InvoiceDocument }));
      const blob = await pdf(<InvoiceDocument invoice={invoice} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Factura_${invoice.invoice_number}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`PDF de factura #${invoice.invoice_number} generado.`);
    } catch {
      toast.error('Ocurrió un error al generar el PDF.');
    }
  }, []);

  const handleEdit = useCallback((inv: InvoiceSummary) => onEdit(inv), [onEdit]);

  const handleDelete = useCallback((inv: InvoiceSummary) => {
    toast
      .promise(
        new Promise<void>((resolve, reject) => {
          if (window.confirm(`¿Seguro que quieres eliminar la factura #${inv.invoice_number}?`)) {
            onDelete(inv);
            resolve();
          } else reject();
        }),
        {
          loading: 'Eliminando factura...',
          success: 'Factura eliminada correctamente',
          error: 'Operación cancelada',
        }
      );
  }, [onDelete]);

  const handleSendEmail = useCallback((inv: InvoiceSummary) => onSendEmail(inv), [onSendEmail]);
  const handleMarkPaid = useCallback((inv: InvoiceSummary) => onMarkPaid(inv), [onMarkPaid]);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto transition-all">
        <table className="min-w-full table-auto text-sm text-gray-800">
          <thead>
            <tr className="bg-gray-100 text-xs uppercase tracking-wide text-gray-600 select-none">
              <th className="px-5 py-3 text-left font-semibold">N° Factura</th>
              <th className="px-5 py-3 text-left font-semibold">Cliente</th>
              <th className="px-5 py-3 text-left font-semibold">ID</th>
              <th className="px-5 py-3 text-left font-semibold">Valor</th>
              <th className="px-5 py-3 text-left font-semibold">Estado</th>
              <th className="px-5 py-3 text-left font-semibold">Vencimiento</th>
              <th className="px-5 py-3 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <InvoiceRow
                key={inv.id}
                inv={inv}
                onSelect={handleSelect}
                onDownloadPdf={handleDownloadPdf}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSendEmail={handleSendEmail}
                onMarkPaid={handleMarkPaid}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de detalle de factura */}
      {selectedInvoice && (
        <Suspense fallback={<div className="p-4 text-center text-sm text-gray-500">Cargando factura...</div>}>
          <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
        </Suspense>
      )}
    </>
  );
};

export default InvoiceTable;