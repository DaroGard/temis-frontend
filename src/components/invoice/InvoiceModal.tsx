import React from 'react';
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
    padding: 20,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  labelValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingBottom: 4,
  },
  itemName: {
    flex: 3,
    fontWeight: 'bold',
  },
  itemDetails: {
    flex: 2,
    textAlign: 'right',
  },
  total: {
    marginTop: 12,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

const InvoiceDocument: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Bufete Garcia del Cid</Text>

        <View style={styles.section}>
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

        <View style={styles.section}>
          <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>
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
            <Text>No hay gastos registrados.</Text>
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
  if (!invoice) return null;

  const safeAmount = Number(invoice.amount) || 0;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-xl font-[var(--font-sans)]"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-black mb-1">Bufete Garcia del Cid</h2>
          <p className="text-sm text-gray-500 mb-6">
            Factura #{invoice.id} – {invoice.client}
          </p>

          <div className="bg-[var(--secondary-color)] p-4 rounded-md grid grid-cols-2 gap-4 text-black text-sm mb-4">
            <div>
              <p className="text-gray-600">Numero de Factura</p>
              <p className="font-medium">#{invoice.id}</p>
            </div>
            <div>
              <p className="text-gray-600">Cliente</p>
              <p className="font-medium">{invoice.client}</p>
            </div>
            <div>
              <p className="text-gray-600">Fecha de Emision</p>
              <p className="font-medium">{invoice.issueDate}</p>
            </div>
            <div>
              <p className="text-gray-600">Fecha de vencimiento</p>
              <p className="font-medium">{invoice.dueDate}</p>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <h3 className="text-black font-semibold mb-3">Itemización del Gasto</h3>

            {Array.isArray(invoice.items) && invoice.items.length > 0 ? (
              invoice.items.map((item, idx) => {
                const safeHours = Number(item.hours) || 0;
                const safeRate = Number(item.rate) || 0;
                const subtotal = safeHours * safeRate;

                return (
                  <div
                    key={idx}
                    className="bg-[var(--secondary-color)] text-black p-3 mb-2 rounded-md flex justify-between"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-600">
                        {safeHours} Hora{safeHours !== 1 ? 's' : ''} x {safeRate.toFixed(2)} US$
                      </p>
                    </div>
                    <p className="font-medium">{subtotal.toFixed(2)} US$</p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">No hay gastos registrados.</p>
            )}

            <div className="mt-4 bg-gray-100 rounded-md p-3 flex justify-between items-center text-black">
              <p className="font-medium">Total</p>
              <p className="text-lg font-semibold">{safeAmount.toFixed(2)} US$</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-white border px-4 py-2 rounded text-black"
            >
              Cerrar
            </button>

            <PDFDownloadLink
              document={<InvoiceDocument invoice={invoice} />}
              fileName={`factura_${invoice.id}.pdf`}
              className="bg-blue-600 text-white px-4 py-2 rounded flex justify-center items-center"
            >
              {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF')}
            </PDFDownloadLink>

            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Marcar como Pagada
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
