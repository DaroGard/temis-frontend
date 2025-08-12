import React, { useEffect, useRef } from 'react';
import type { Invoice } from '~/types/invoice';
import { motion } from 'framer-motion';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoiceDocument } from './InvoiceDocument';

interface Props {
  invoice: Invoice | null;
  onClose: () => void;
}

const formatCurrency = (value: number) =>
  value.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

export const InvoiceModal: React.FC<Props> = ({ invoice, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!invoice) return null;

  const totalCalculated =
    invoice.items?.reduce((acc, item) => acc + (Number(item.hours) || 0) * (Number(item.rate) || 0), 0) ?? 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.25 }}
        tabIndex={-1}
        className="w-full max-w-2xl bg-white rounded-xl shadow-xl focus:outline-none font-[var(--font-sans)]"
      >
        <div className="p-8">
          {/* Título */}
          <h2 id="invoice-modal-title" className="text-2xl font-bold mb-2 text-black">
            Bufete García del Cid
          </h2>
          <p className="text-gray-600 text-lg mb-6 font-medium">
            Factura #{invoice.id} – {invoice.client}
          </p>

          {/* Datos */}
          <div className="grid grid-cols-2 gap-6 bg-[var(--secondary-color)] rounded-lg p-6 text-black text-sm mb-6">
            {[
              ['Número de Factura', `#${invoice.id}`],
              ['Cliente', invoice.client],
              ['Fecha de Emisión', invoice.issueDate],
              ['Fecha de Vencimiento', invoice.dueDate],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-gray-700 font-semibold">{label}</p>
                <p className="text-base font-semibold">{value}</p>
              </div>
            ))}
          </div>

          {/* Ítems */}
          <section aria-labelledby="items-section" className="mb-6">
            <h3 id="items-section" className="text-xl font-semibold mb-3 text-black">
              Itemización del Gasto
            </h3>

            {invoice.items?.length ? (
              invoice.items.map((item, idx) => {
                const hours = Number(item.hours) || 0;
                const rate = Number(item.rate) || 0;
                const subtotal = hours * rate;
                return (
                  <div
                    key={idx}
                    className="bg-[var(--secondary-color)] text-black p-4 mb-3 rounded-md flex justify-between items-center"
                  >
                    <div>
                      <p className="text-base font-semibold">{item.name}</p>
                      <p className="text-xs text-gray-700 mt-1">
                        {hours} Hora{hours !== 1 ? 's' : ''} x {rate.toFixed(2)} US$
                      </p>
                    </div>
                    <p className="text-lg font-semibold">{subtotal.toFixed(2)} US$</p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm italic text-gray-500">No hay gastos registrados.</p>
            )}

            {/* Total calculado */}
            <div className="mt-6 bg-gray-100 rounded-md p-4 flex justify-between items-center text-black">
              <p className="text-lg font-semibold">Total</p>
              <p className="text-2xl font-bold">{formatCurrency(totalCalculated)}</p>
            </div>
          </section>

          {/* Footer de acciones */}
          <footer className="mt-8 flex flex-wrap justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 border border-gray-400 hover:border-gray-600 text-gray-800 rounded-md transition focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 focus:outline-none"
            >
              Cerrar
            </button>

            <PDFDownloadLink
              document={<InvoiceDocument invoice={invoice} />}
              fileName={`factura_${invoice.id}.pdf`}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition focus:ring-2 focus:ring-offset-1 focus:ring-blue-600 focus:outline-none"
            >
              {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF')}
            </PDFDownloadLink>

            <button
              type="button"
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition focus:ring-2 focus:ring-offset-1 focus:ring-green-600 focus:outline-none"
              onClick={() => alert('Factura marcada como pagada')}
            >
              Marcar como Pagada
            </button>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};