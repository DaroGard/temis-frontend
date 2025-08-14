import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { Navbar } from '~/components/layout/user/UserNavbar';
import Footer from '~/components/layout/user/UserFooter';
import { SearchBar } from '~/components/invoice/SearchBar';
import { Button } from '~/components/generals/button';
import type { InvoiceSummary, InvoiceStatus } from '~/types/invoice';
import type { Client } from '~/types/client';
import { ArrowLeft } from 'lucide-react';
import { InvoiceCreateModal, InvoiceFormData } from '~/components/invoice/InvoiceCreateModal';
import InvoiceTable from '~/components/invoice/InvoiceTable';
import toast, { Toaster } from 'react-hot-toast';

export const Route = createFileRoute('/InvoicesPage')({
  component: Invoices,
});

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const ITEMS_PER_PAGE = 5;

// Hook para facturas y clientes
function useInvoicesAndClients() {
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [invRes, clientRes] = await Promise.all([
        fetch(`${API_DOMAIN}/invoice/all`, { credentials: 'include' }),
        fetch(`${API_DOMAIN}/invoice/clients`, { credentials: 'include' }),
      ]);

      if (!invRes.ok) throw new Error('Error cargando facturas');
      if (!clientRes.ok) throw new Error('Error cargando clientes');

      const invData = await invRes.json();
      const clientData = await clientRes.json();

      const today = new Date();
      const invoicesList = Array.isArray(invData?.invoices)
        ? invData.invoices.map((inv: InvoiceSummary) => {
          const dueDate = new Date(inv.due_date);
          return inv.status === 'Pendiente' && dueDate < today
            ? { ...inv, status: 'Vencida' as InvoiceStatus }
            : inv;
        })
        : [];

      setInvoices(invoicesList);
      setClients(Array.isArray(clientData?.clients) ? clientData.clients : []);
    } catch (err: any) {
      setError(err.message || 'Error desconocido al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return { invoices, clients, loading, error, refresh: fetchData };
}

// Componente principal
function Invoices() {
  const { invoices, clients, loading, error, refresh } = useInvoicesAndClients();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrado
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const searchable = `${inv.client_name ?? ''} ${inv.invoice_number ?? ''} ${inv.id}`.toLowerCase();
      return searchable.includes(search.toLowerCase()) && (filterStatus ? inv.status === filterStatus : true);
    });
  }, [invoices, search, filterStatus]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE));
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [currentPage, totalPages]);
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Crear factura
  const handleCreateInvoice = async (newInvoice: InvoiceFormData) => {
    try {
      const payload = {
        client_id: newInvoice.client_id,
        emission_date: newInvoice.issueDate,
        due_date: newInvoice.dueDate,
        items: newInvoice.items.map((item) => ({
          description: item.description,
          hours_worked: item.hours_worked,
          hourly_rate: item.hourly_rate,
        })),
      };

      const res = await fetch(`${API_DOMAIN}/invoice/create-preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || 'Error al crear factura');
      }

      await refresh();
      setIsModalOpen(false);
      toast.success('Factura creada correctamente');
    } catch (err: any) {
      toast.error(err.message || 'Error desconocido al crear factura');
    }
  };

  // Actualizar factura
  const handleUpdateInvoice = async () => {
    await refresh();
  };

  return (
    <div className="bg-[#f4f6f8] min-h-screen flex flex-col">
      <Navbar />
      <Toaster position="top-right" reverseOrder={false} />

      {/* Retorno */}
      <div className="px-6 pt-4 md:flex md:items-center md:justify-between">
        <a href="/dashboard" className="inline-flex items-center text-sm text-slate-700 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4 mr-2" /> Regresar
        </a>
      </div>

      {/* Contenido */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 sm:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black">Facturas</h1>
            <p className="text-gray-600 mt-1">Gestiona la facturación de tus casos</p>
          </div>
          <Button
            className="bg-[var(--primary-color)] text-white px-6 py-3 rounded-md shadow-md hover:bg-links focus:ring-4 focus:ring-links transition"
            onClick={() => setIsModalOpen(true)}
          >
            + Nueva Factura
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <SearchBar onSearch={setSearch} className="flex-1 min-w-[280px]" />
          <div className="flex gap-3 items-center">
            <select
              className="text-sm border border-gray-300 rounded-md px-3 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-links focus:border-links transition"
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value as InvoiceStatus | ''); setCurrentPage(1); }}
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Pagada">Pagada</option>
              <option value="Vencida">Vencida</option>
            </select>
          </div>
        </div>

        {/* Listado de facturas */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />)}
          </div>
        ) : error ? (
          <p className="text-center py-10 text-warning">{error}</p>
        ) : paginatedInvoices.length > 0 ? (
          <>
            <Suspense fallback={<p className="text-center py-10 text-gray-400">Cargando facturas...</p>}>
              <InvoiceTable
                invoices={paginatedInvoices}
                onEdit={handleUpdateInvoice}
                onMarkPaid={handleUpdateInvoice}
                onDelete={async (deletedInvoice) => { await refresh(); toast.success(`Factura #${deletedInvoice.invoice_number} eliminada correctamente`); }}
                onSendEmail={() => toast('Función de enviar email no implementada', { icon: '📧' })}
                onMarkPaidSuccess={() => refresh()}
              />
            </Suspense>

            {/* Paginación */}
            <nav className="flex justify-center items-center gap-6 pt-6">
              <Button variant="outline" className="px-5 py-2 flex items-center gap-1" onClick={handlePrev} disabled={currentPage === 1}>‹ Anterior</Button>
              <span className="text-sm text-gray-700" aria-live="polite" aria-atomic="true">Página {currentPage} de {totalPages}</span>
              <Button variant="outline" className="px-5 py-2 flex items-center gap-1" onClick={handleNext} disabled={currentPage === totalPages}>Siguiente ›</Button>
            </nav>
          </>
        ) : (
          <div className="text-center mt-12">
            <p className="text-gray-500">No se encontraron facturas con los criterios indicados.</p>
            <Button onClick={() => setIsModalOpen(true)} className="mt-4">Crear primera factura</Button>
          </div>
        )}
      </main>

      {/* Modal de creación */}
      <InvoiceCreateModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateInvoice} clients={clients} />

      <Footer />
    </div>
  );
}