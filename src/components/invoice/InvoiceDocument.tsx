import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Invoice } from '~/types/invoice';

interface Props {
  invoice: Invoice;
}

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 20,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  infoText: {
    marginBottom: 6,
    color: '#444',
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 6,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemName: {
    flex: 2,
    fontWeight: 'bold',
    color: '#222',
  },
  itemDetails: {
    flex: 1,
    textAlign: 'right',
    color: '#555',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#bbb',
    marginTop: 20,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 12,
    color: '#111',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  noItemsText: {
    fontStyle: 'italic',
    color: '#888',
  },
});

const formatCurrency = (value: number) =>
  `$${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const InvoiceDocument: React.FC<Props> = ({ invoice }) => {
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
      return invoice.items.reduce((acc, item, idx) => {
        const hours = toSafeNumber(item.hours, `items[${idx}].hours`);
        const rate = toSafeNumber(item.rate, `items[${idx}].rate`);
        return acc + hours * rate;
      }, 0);
    }

    return 0;
  };

  const displayAmount = calculateTotal();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Bufete Garcia del Cid</Text>

        <View style={styles.section}>
          <Text style={styles.infoText}>Factura #{invoice.id}</Text>
          <Text style={styles.infoText}>Cliente: {invoice.client}</Text>
          <Text style={styles.infoText}>
            Fecha de Emisión: {formatDate(invoice.issueDate)}
          </Text>
          <Text style={styles.infoText}>
            Fecha de Vencimiento: {formatDate(invoice.dueDate)}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.itemHeaderRow}>
            <Text style={styles.itemName}>Descripción</Text>
            <Text style={styles.itemDetails}>Horas x Tarifa</Text>
            <Text style={styles.itemDetails}>Subtotal</Text>
          </View>

          {Array.isArray(invoice.items) && invoice.items.length > 0 ? (
            invoice.items.map((item, idx) => {
              const hours = toSafeNumber(item.hours, `items[${idx}].hours`);
              const rate = toSafeNumber(item.rate, `items[${idx}].rate`);
              const subtotal = hours * rate;
              return (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDetails}>
                    {hours}h x {formatCurrency(rate)}
                  </Text>
                  <Text style={styles.itemDetails}>{formatCurrency(subtotal)}</Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.noItemsText}>No hay gastos registrados.</Text>
          )}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{formatCurrency(displayAmount)}</Text>
        </View>
      </Page>
    </Document>
  );
};