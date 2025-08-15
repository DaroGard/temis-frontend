import React, { useEffect, useRef, useCallback, useState } from 'react';
import type { InvoiceSummary } from '~/types/invoice';
import { motion, AnimatePresence } from 'framer-motion';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoiceDocument } from './InvoiceDocument';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

interface Props {
  invoice: InvoiceSummary | null;
  onClose: () => void;
  onMarkPaidSuccess?: () => void;
}

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;

const formatCurrency = (value: number) =>
  value.toLocaleString('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

const dueStatusColor = (dueDate: string, status: string) => {
  if (status.toLowerCase() === 'pagada') return 'bg-green-100 text-success';
  const today = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'bg-red-100 text-warning';
  if (diffDays <= 3) return 'bg-yellow-100 text-pending';
  return 'bg-yellow-100 text-pending';
};

const StatusBadge: React.FC<{ status: string; dueDate: string }> = ({ status, dueDate }) => (
  <motion.span
    initial={{ scale: 0.8, opacity: 0.6 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
    className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${dueStatusColor(dueDate, status)}`}
  >
    {status}
  </motion.span>
);

export const InvoiceModal: React.FC<Props> = ({ invoice, onClose, onMarkPaidSuccess }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [loadingAction, setLoadingAction] = useState<'mark' | null>(null);

  // cierre modal
  const handleEscape = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
    [onClose]
  );

  const handleClickOutside = useCallback(
    (e: MouseEvent) => { if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose(); },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleEscape, handleClickOutside]);

  if (!invoice) return null;

  const items = invoice.items ?? [];
  const totalCalculated =
    items.length > 0
      ? items.reduce(
        (acc, item) => acc + (Number(item.hours_worked ?? 0) * Number(item.hourly_rate ?? 0)),
        0
      )
      : invoice.total_amount ?? 0;

  const isPaid = invoice.status.toLowerCase() === 'pagada';

  // Marcar como pagada 
  const handleMarkPaid = async () => {
    if (isPaid) return;
    setLoadingAction('mark');

    try {
      const res = await fetch(`${API_DOMAIN}/invoice/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: invoice.id, status: 'PAYED' }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || 'Error al marcar como pagada');
      }

      toast.success('Factura marcada como pagada');
      invoice.status = 'Pagada';

      onMarkPaidSuccess?.();

    } catch (err: any) {
      toast.error(err?.message || 'Error al marcar como pagada');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <AnimatePresence>
      {/* Fondo modal */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="invoice-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Panel modal */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          tabIndex={-1}
          className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto focus:outline-none font-sans"
        >
          <div className="p-8 space-y-6">

            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 id="invoice-modal-title" className="text-2xl font-bold text-gray-900">
                  Detalles de Factura
                </h2>
                <p className="text-gray-600 mt-1 text-base font-medium">
                  Factura #{invoice.invoice_number} – {invoice.client_name}
                </p>
              </div>
              <span
                onClick={onClose}
                className="cursor-pointer text-gray-400 hover:text-gray-700 text-3xl font-bold transition"
              >
                &times;
              </span>
            </div>

            {/* Información general */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-6 shadow-sm text-primary">
              {[
                ['Número de Factura', `#${invoice.invoice_number}`],
                ['Cliente', invoice.client_name],
                ['Fecha de Emisión', invoice.emission_date],
                ['Fecha de Vencimiento', invoice.due_date],
                ['Estado', <StatusBadge status={invoice.status} dueDate={invoice.due_date} key="status" />],
              ].map(([label, value]) => (
                <div key={label.toString()} className="flex flex-col">
                  <span className="text-xs text-gray-500 font-semibold">{label}</span>
                  <span className="text-base font-semibold">{value}</span>
                </div>
              ))}
            </div>

            {/* Itemización */}
            <section aria-labelledby="items-section" className="space-y-3">
              <h3 id="items-section" className="text-xl font-semibold text-gray-900">
                Itemización del Gasto
              </h3>

              {items.length > 0 ? (
                items.map((item, idx) => {
                  const hours = Number(item.hours_worked ?? 0);
                  const rate = Number(item.hourly_rate ?? 0);
                  const subtotal = hours * rate;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition cursor-pointer"
                      data-tooltip-id={`item-tooltip-${idx}`}
                      data-tooltip-content={`Subtotal: ${subtotal.toFixed(2)} US$`}
                    >
                      <div className="space-y-1">
                        <p className="text-base font-semibold text-gray-900">{item.description}</p>
                        <p className="text-xs text-gray-500">
                          {hours} Hora{hours !== 1 ? 's' : ''} x {rate.toFixed(2)} US$
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{subtotal.toFixed(2)} US$</p>
                      <Tooltip id={`item-tooltip-${idx}`} place="top" />
                    </div>
                  );
                })
              ) : (
                <p className="text-sm italic text-gray-400">No hay gastos registrados.</p>
              )}

              {/* Total */}
              <div className="mt-4 bg-gray-100 rounded-xl p-4 flex justify-between items-center shadow-inner">
                <p className="text-lg font-semibold text-gray-900">Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCalculated)}</p>
              </div>
            </section>

            {/* Footer */}
            <footer className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2 border border-gray-300 hover:border-gray-500 text-gray-800 rounded-xl transition focus:ring-2 focus:ring-offset-1 focus:ring-gray-300 focus:outline-none"
              >
                Cerrar
              </button>

              <PDFDownloadLink
                document={<InvoiceDocument invoice={invoice} />}
                fileName={`factura_${invoice.invoice_number}.pdf`}
                className="px-5 py-2 bg-links hover:bg-links-dark text-white rounded-xl transition focus:ring-2 focus:ring-offset-1 focus:ring-links focus:outline-none"
              >
                {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF')}
              </PDFDownloadLink>

              <button
                type="button"
                className={`px-5 py-2 rounded-xl transition focus:ring-2 focus:ring-offset-1 focus:outline-none ${isPaid
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-success hover:bg-success-dark text-white focus:ring-success'
                  }`}
                onClick={handleMarkPaid}
                disabled={isPaid || loadingAction === 'mark'}
              >
                {loadingAction === 'mark' ? 'Marcando...' : 'Marcar como Pagada'}
              </button>

            </footer>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};