import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Invoice } from '~/types/invoice';

interface Props {
  invoice: Invoice;
}

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  section: { marginBottom: 10 },
  header: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  itemName: { fontWeight: 'bold' },
  total: { marginTop: 20, fontSize: 14, fontWeight: 'bold', textAlign: 'right' },
});

export const InvoiceDocument: React.FC<Props> = ({ invoice }) => {
  console.log('Invoice completo:', invoice);

  const toSafeNumber = (value: any, label = ''): number => {
    const n = Number(value);
    if (isNaN(n)) {
      console.warn(`Valor inválido para ${label}:`, value);
      return 0;
    }
    return n;
  };

  const calculateTotal = (): number => {
    const amountNum = toSafeNumber(invoice.amount, 'invoice.amount');
    if (amountNum > 0) return amountNum;

    if (Array.isArray(invoice.items) && invoice.items.length > 0) {
      const sum = invoice.items.reduce((acc, item, idx) => {
        const hours = toSafeNumber(item.hours, `items[${idx}].hours`);
        const rate = toSafeNumber(item.rate, `items[${idx}].rate`);
        return acc + hours * rate;
      }, 0);
      console.log('Total calculado sumando items:', sum);
      return sum;
    }

    return 0;
  };

  const displayAmount = calculateTotal();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Bufete Garcia del Cid</Text>

        <View style={styles.section}>
          <Text>Factura #{invoice.id}</Text>
          <Text>Cliente: {invoice.client}</Text>
          <Text>Fecha de Emisión: {invoice.issueDate}</Text>
          <Text>Fecha de Vencimiento: {invoice.dueDate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ marginBottom: 8 }}>Itemización del Gasto:</Text>
          {Array.isArray(invoice.items) && invoice.items.length > 0 ? (
            invoice.items.map((item, idx) => {
              const hours = toSafeNumber(item.hours, `items[${idx}].hours`);
              const rate = toSafeNumber(item.rate, `items[${idx}].rate`);
              const subtotal = hours * rate;
              return (
                <View key={idx} style={styles.row}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text>{hours}h x ${rate.toFixed(2)}</Text>
                  <Text>${subtotal.toFixed(2)}</Text>
                </View>
              );
            })
          ) : (
            <Text>No hay gastos registrados.</Text>
          )}
        </View>

        <Text style={styles.total}>Total: ${displayAmount.toFixed(2)}</Text>
      </Page>
    </Document>
  );
};
