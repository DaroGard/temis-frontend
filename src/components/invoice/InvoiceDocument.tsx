import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { InvoiceSummary } from '~/types/invoice';

interface Props {
  invoice: InvoiceSummary;
}

// Estilos
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#0B3D91',
    letterSpacing: 1,
  },
  headerLine: {
    height: 2,
    backgroundColor: '#0B3D91',
    width: '100%',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  infoText: {
    marginBottom: 4,
    fontSize: 12,
    lineHeight: 1.5,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    color: '#0B3D91',
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1.2,
    borderBottomColor: '#cfd4da',
    paddingBottom: 6,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  itemRowAlt: {
    backgroundColor: '#f1f3f6',
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
    marginTop: 28,
    paddingTop: 14,
    borderTopWidth: 1.5,
    borderTopColor: '#bbb',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 14,
    color: '#0B3D91',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B3D91',
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
    color: '#777',
    marginTop: 36,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});

// Formateo
const formatCurrency = (value: number): string =>
  value.toLocaleString('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? dateStr
    : d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Componente principal
export const InvoiceDocument: React.FC<Props> = ({ invoice }) => {
  const items = invoice.items ?? [];

  const totalAmount =
    invoice.total_amount ??
    items.reduce(
      (acc, item) =>
        acc + (Number(item.hours_worked) || 0) * (Number(item.hourly_rate) || 0),
      0
    );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/*  Header */}
        <Text style={styles.header}>Factura #{invoice.invoice_number}</Text>
        <View style={styles.headerLine} />

        {/*  Datos */}
        <View style={styles.section}>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Cliente: </Text>
            {invoice.client_name}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Fecha de Emisión: </Text>
            {formatDate(invoice.emission_date)}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Fecha de Vencimiento: </Text>
            {formatDate(invoice.due_date)}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Estado: </Text>
            {invoice.status}
          </Text>
        </View>

        {/*  Detalle de items */}
        <View style={styles.section}>
          <View style={styles.itemHeaderRow}>
            <Text style={styles.itemName}>Descripción</Text>
            <Text style={styles.itemDetails}>Horas x Tarifa</Text>
            <Text style={styles.itemDetails}>Subtotal</Text>
          </View>

          {items.length > 0 ? (
            items.map((item, idx) => {
              const hours = Number(item.hours_worked) || 0;
              const rate = Number(item.hourly_rate) || 0;
              const subtotal = hours * rate;
              return (
                <View
                  key={idx}
                  style={[styles.itemRow, idx % 2 === 0 ? styles.itemRowAlt : {}]}
                >
                  <Text style={styles.itemName}>{item.description}</Text>
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

        {/*  Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalAmount)}</Text>
        </View>

        {/*  Footer  */}
        <Text style={styles.footer}>
          Gracias por su preferencia. Para cualquier consulta, contacte con nuestro bufete.
        </Text>
      </Page>
    </Document>
  );
};