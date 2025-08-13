import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useMemo, Suspense, useEffect } from 'react';
import { Navbar } from '~/components/layout/user/UserNavbar';
import Footer from '~/components/layout/user/UserFooter';
import { SearchBar } from '~/components/invoice/SearchBar';
import { Button } from '~/components/generals/button';
import type { Invoice, InvoiceStatus } from '~/types/invoice';
import type { Client } from '~/types/client';
import { ArrowLeft } from 'lucide-react';
import { InvoiceCreateModal, InvoiceFormData } from '~/components/invoice/InvoiceCreateModal';
import InvoiceTable from '~/components/invoice/InvoiceTable';

export const Route = createFileRoute('/InvoicesPage')({
  component: Invoices,
});

const API_BASE_URL = 'http://localhost:8000';

function Invoices() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvoices() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/invoice/all`, { credentials: 'include' });
        if (!res.ok) {
          throw new Error(`${res.statusText}`);
        }
        const data = await res.json();

        const mapped: Invoice[] = data.map((inv: any) => ({
          ...inv,
          client: inv.client,
          issueDate: inv.issue_date,
          dueDate: inv.due_date,
        }));

        console.log("Datos crudos del backend:", data);
        setInvoices(mapped);
      } catch (err: any) {
        setError(err.message || 'Error desconocido al cargar facturas');
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, []);

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch(`${API_BASE_URL}/clients`, { credentials: 'include' });
        if (!res.ok) throw new Error('No se pudieron cargar los clientes');
        const data: Client[] = await res.json();
        setClients(data);
      } catch {
        setClients([]);
      }
    }
    fetchClients();
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const searchableString = `${inv.client_name ?? ''} ${inv.caseNumber} ${inv.id}`.toLowerCase();
      const matchesSearch = searchableString.includes(search.toLowerCase());
      const matchesStatus = filterStatus ? inv.status === filterStatus : true;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleCreateInvoice = async (newInvoice: InvoiceFormData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        client_id: newInvoice.client_id,
        emission_date: newInvoice.issueDate,
        due_date: newInvoice.dueDate,
        items: newInvoice.items.map((item) => ({
          description: item.name,
          hours_worked: item.hours,
          hourly_rate: item.rate,
        })),
      };
      const res = await fetch(`${API_BASE_URL}/create-preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || 'Error al crear factura');
      }

      const createdInvoice: Invoice = await res.json();

      setInvoices((old) => [...old, createdInvoice]);
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Error desconocido al crear factura');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInvoice = (updatedInvoice: Invoice) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === updatedInvoice.id ? updatedInvoice : inv))
    );
  };

  if (loading) return <p className="text-center py-10">Cargando...</p>;
  if (error) return <p className="text-center py-10 text-warning">Error: {error}</p>;

  return (
    <div className="bg-[#f4f6f8] min-h-screen flex flex-col">
      <Navbar />
      <div className="px-6 pt-4">
        <a
          href="/dashboard"
          className="inline-flex items-center text-sm text-slate-700 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Regresar
        </a>
      </div>
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 sm:px-8 py-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black">Facturas</h1>
            <p className="text-gray-600 mt-1">Gestiona la facturación de tus casos</p>
          </div>
          <Button
            className="bg-[var(--primary-color)] text-white px-6 py-3 rounded-md shadow-md hover:bg-links focus:ring-4 focus:ring-links transition"
            aria-label="Crear nueva factura"
            onClick={() => setIsModalOpen(true)}
          >
            + Nueva Factura
          </Button>
        </header>
        <section className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <SearchBar onSearch={setSearch} className="flex-1 min-w-[280px]" />
          <div className="flex gap-3 items-center">
            <select
              className="text-sm border border-gray-300 rounded-md px-3 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-links focus:border-links transition"
              aria-label="Filtrar facturas por estado"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as InvoiceStatus | '');
                setCurrentPage(1);
              }}
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Pagada">Pagada</option>
              <option value="Vencida">Vencida</option>
            </select>
            <Button variant="outline" className="text-sm px-4 py-2">
              Filtros
            </Button>
          </div>
        </section>
        {paginatedInvoices.length > 0 ? (
          <>
            <Suspense fallback={<p className="text-center py-10 text-gray-400">Cargando facturas...</p>}>
              <InvoiceTable 
                invoices={paginatedInvoices}
                onEdit={handleUpdateInvoice}
                onMarkPaid={handleUpdateInvoice} onDelete={function (inv: Invoice): void {
                  throw new Error('Function not implemented.');
                } } onSendEmail={function (inv: Invoice): void {
                  throw new Error('Function not implemented.');
                } } />
            </Suspense>
            <nav
              className="flex justify-center items-center gap-6 pt-6"
              role="navigation"
              aria-label="Paginación de facturas"
            >
              <Button
                variant="outline"
                className="px-5 py-2 flex items-center gap-1"
                onClick={handlePrev}
                disabled={currentPage === 1}
                aria-label="Página anterior"
              >
                ‹ Anterior
              </Button>
              <span className="text-sm text-gray-700" aria-live="polite" aria-atomic="true">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                className="px-5 py-2 flex items-center gap-1"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
              >
                Siguiente ›
              </Button>
            </nav>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-10">No se encontraron facturas con los criterios indicados.</p>
        )}
      </main>
      <InvoiceCreateModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateInvoice}
        clients={clients}
      />
      <Footer />
    </div>
  );
}