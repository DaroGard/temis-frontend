import React, { useEffect, useRef } from 'react';
import type { Invoice } from '~/types/invoice';
import { motion } from 'framer-motion';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';

interface Props {
  invoice: Invoice | null;
  onClose: () => void;
}

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#fafafa',
  },
  header: {
    fontSize: 22,
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#222',
  },
  section: {
    marginBottom: 16,
  },
  labelValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 0.7,
    borderBottomColor: '#ccc',
    paddingBottom: 6,
  },
  itemName: {
    flex: 3,
    fontWeight: '600',
    color: '#111',
  },
  itemDetails: {
    flex: 2,
    textAlign: 'right',
    color: '#333',
  },
  total: {
    marginTop: 20,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
});

const InvoiceDocument: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Bufete Garcia del Cid</Text>

        <View style={styles.section} aria-label="Datos de factura">
          <View style={styles.labelValueRow}>
            <Text>Factura #:</Text>
            <Text>{invoice.id}</Text>
          </View>
          <View style={styles.labelValueRow}>
            <Text>Cliente:</Text>
            <Text>{invoice.client}</Text>
          </View>
          <View style={styles.labelValueRow}>
            <Text>Fecha de Emisión:</Text>
            <Text>{invoice.issueDate}</Text>
          </View>
          <View style={styles.labelValueRow}>
            <Text>Fecha de Vencimiento:</Text>
            <Text>{invoice.dueDate}</Text>
          </View>
        </View>

        <View style={styles.section} aria-label="Itemización de gastos">
          <Text
            style={{ fontWeight: 'bold', marginBottom: 8, fontSize: 14, color: '#222' }}
          >
            Itemización del Gasto:
          </Text>

          {Array.isArray(invoice.items) && invoice.items.length > 0 ? (
            invoice.items.map((item, idx) => {
              const hours = Number(item.hours) || 0;
              const rate = Number(item.rate) || 0;
              const subtotal = hours * rate;
              return (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDetails}>
                    {hours}h x ${rate.toFixed(2)}
                  </Text>
                  <Text style={styles.itemDetails}>${subtotal.toFixed(2)}</Text>
                </View>
              );
            })
          ) : (
            <Text style={{ fontStyle: 'italic', color: '#666' }}>
              No hay gastos registrados.
            </Text>
          )}
        </View>

        <Text style={styles.total}>
          Total: ${Number(invoice.amount).toFixed(2)} US$
        </Text>
      </Page>
    </Document>
  );
};

export const InvoiceModal: React.FC<Props> = ({ invoice, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!invoice) return null;

  const safeAmount = Number(invoice.amount) || 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-modal-title"
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl font-[var(--font-sans)] focus:outline-none"
        tabIndex={-1}
      >
        <div className="p-8">
          <h2
            id="invoice-modal-title"
            className="text-2xl font-bold text-black mb-2"
          >
            Bufete Garcia del Cid
          </h2>
          <p className="text-gray-600 mb-6 text-lg font-medium">
            Factura #{invoice.id} – {invoice.client}
          </p>

          <div className="grid grid-cols-2 gap-6 bg-[var(--secondary-color)] rounded-lg p-6 text-black text-sm mb-6">
            {[
              { label: 'Número de Factura', value: `#${invoice.id}` },
              { label: 'Cliente', value: invoice.client },
              { label: 'Fecha de Emisión', value: invoice.issueDate },
              { label: 'Fecha de Vencimiento', value: invoice.dueDate },
            ].map(({ label, value }) => (
              <div key={label} className="">
                <p className="text-gray-700 text-xs font-semibold">{label}</p>
                <p className="font-semibold text-base">{value}</p>
              </div>
            ))}
          </div>

          <section aria-labelledby="items-section" className="mb-6">
            <h3
              id="items-section"
              className="text-black font-semibold text-xl mb-3"
            >
              Itemización del Gasto
            </h3>

            {Array.isArray(invoice.items) && invoice.items.length > 0 ? (
              invoice.items.map((item, idx) => {
                const safeHours = Number(item.hours) || 0;
                const safeRate = Number(item.rate) || 0;
                const subtotal = safeHours * safeRate;

                return (
                  <div
                    key={idx}
                    className="bg-[var(--secondary-color)] text-black p-4 mb-3 rounded-md flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-base">{item.name}</p>
                      <p className="text-xs text-gray-700 mt-1">
                        {safeHours} Hora{safeHours !== 1 ? 's' : ''} x{' '}
                        {safeRate.toFixed(2)} US$
                      </p>
                    </div>
                    <p className="font-semibold text-lg">{subtotal.toFixed(2)} US$</p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 italic text-sm">
                No hay gastos registrados.
              </p>
            )}

            <div className="mt-6 bg-gray-100 rounded-md p-4 flex justify-between items-center text-black">
              <p className="font-semibold text-lg">Total</p>
              <p className="text-2xl font-bold">{safeAmount.toFixed(2)} US$</p>
            </div>
          </section>

          <footer className="mt-8 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="border border-gray-400 hover:border-gray-600 text-gray-800 px-5 py-2 rounded-md transition focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 focus:outline-none"
              type="button"
            >
              Cerrar
            </button>

            <PDFDownloadLink
              document={<InvoiceDocument invoice={invoice} />}
              fileName={`factura_${invoice.id}.pdf`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md flex items-center justify-center transition focus:ring-2 focus:ring-offset-1 focus:ring-blue-600 focus:outline-none"
            >
              {({ loading }) =>
                loading ? 'Generando PDF...' : 'Descargar PDF'
              }
            </PDFDownloadLink>

            <button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md transition focus:ring-2 focus:ring-offset-1 focus:ring-green-600 focus:outline-none"
              onClick={() => alert('Marcar como pagada')}
            >
              Marcar como Pagada
            </button>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};