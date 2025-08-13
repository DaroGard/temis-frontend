import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Invoice } from '~/types/invoice';

interface Props {
  invoice: Invoice;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#fff',
    color: '#1a1a1a',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#003366',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    border: '1pt solid #ddd',
  },
  infoText: {
    marginBottom: 8,
    fontSize: 12,
    lineHeight: 1.5,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    color: '#003366',
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
    paddingBottom: 8,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  itemName: {
    flex: 3,
    fontWeight: '600',
    color: '#222',
  },
  itemDetails: {
    flex: 1,
    textAlign: 'right',
    color: '#555',
    fontSize: 11,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 32,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#aaa',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 14,
    color: '#003366',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
  },
  noItemsText: {
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
  },
  footer: {
    fontSize: 10,
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 8,
  },
});

const formatCurrency = (value: number): string =>
  `$${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? dateStr
    : d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
};

const toSafeNumber = (value: any, label = ''): number => {
  const n = Number(value);
  if (isNaN(n)) {
    console.warn(`Valor inválido para ${label}:`, value);
    return 0;
  }
  return n;
};

export const InvoiceDocument: React.FC<Props> = ({ invoice }) => {
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

  const totalAmount = calculateTotal();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabecera */}
        <Text style={styles.header}>Detalles de Factura</Text>

        {/* Datos básicos */}
        <View style={styles.section}>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Factura: </Text>#{invoice.id}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Cliente: </Text>{invoice.client || 'Desconocido'}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Fecha de Emisión: </Text>{formatDate(invoice.issueDate)}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Fecha de Vencimiento: </Text>{formatDate(invoice.dueDate)}
          </Text>
        </View>

        {/* Detalle de items */}
        <View style={styles.section}>
          <View style={styles.itemHeaderRow}>
            <Text style={styles.itemName}>Descripción</Text>
            <Text style={styles.itemDetails}>Horas x Tarifa</Text>
            <Text style={styles.itemDetails}>Subtotal</Text>
          </View>

          {invoice.items?.length > 0 ? (
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

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalAmount)}</Text>
        </View>

        {/* Pie de página */}
        <Text style={styles.footer}>
          Gracias por su preferencia. Para cualquier consulta, contacte con nuestro bufete.
        </Text>
      </Page>
    </Document>
  );
};