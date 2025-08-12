import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useMemo, Suspense, useEffect } from 'react';
import { Navbar } from '~/components/layout/user/UserNavbar';
import Footer from '~/components/layout/user/UserFooter';

const InvoiceTable = React.lazy(() => import('~/components/invoice/InvoiceTable'));

import { SearchBar } from '~/components/invoice/SearchBar';
import { Button } from '~/components/generals/button';
import type { Invoice, InvoiceStatus } from '~/types/invoice';
import { ArrowLeft } from 'lucide-react';
import { InvoiceCreateModal } from '~/components/invoice/InvoiceCreateModal';

const mockInvoices: Invoice[] = [
  {
    id: 3100,
    client: 'Horn',
    caseNumber: '02215-2018',
    amount: '1100,00 US$',
    status: 'Pendiente',
    dueDate: '2024-06-15',
    issueDate: '2024-05-01',
    items: [
      { name: 'Consulta legal', hours: 5, rate: 50 },
      { name: 'Redacción de documentos', hours: 7, rate: 50 },
    ],
  },
  {
    id: 3101,
    client: 'Guillermo',
    caseNumber: '03456-2024',
    amount: '1300,00 US$',
    status: 'Pagada',
    dueDate: '2024-06-20',
    issueDate: '2024-05-01',
    items: [
      { name: 'Audiencia y representación', hours: 10, rate: 65 },
      { name: 'Revisión de contrato', hours: 5, rate: 40 },
    ],
  },
  {
    id: 3102,
    client: 'Maria',
    caseNumber: '01789-2023',
    amount: '2500,00 US$',
    status: 'Vencida',
    dueDate: '2023-05-30',
    issueDate: '2024-05-01',
    items: [
      { name: 'Asesoría integral', hours: 20, rate: 100 },
      { name: 'Gestión documental', hours: 5, rate: 50 },
    ],
  },
  {
    id: 3103,
    client: 'David',
    caseNumber: '02418-2025',
    amount: '1400,00 US$',
    status: 'Pendiente',
    dueDate: '2024-07-11',
    issueDate: '2024-05-01',
    items: [
      { name: 'Revisión legal', hours: 8, rate: 70 },
      { name: 'Asistencia en negociación', hours: 6, rate: 50 },
    ],
  },
  {
    id: 3104,
    client: 'Jose',
    caseNumber: '06275-2020',
    amount: '1000,00 US$',
    status: 'Pendiente',
    dueDate: '2025-08-16',
    issueDate: '2024-05-01',
    items: [
      { name: 'Consulta inicial', hours: 4, rate: 50 },
      { name: 'Elaboración de documentos', hours: 8, rate: 60 },
    ],
  },
  {
    id: 3105,
    client: 'Lucas',
    caseNumber: '01235-2021',
    amount: '1500,00 US$',
    status: 'Pagada',
    dueDate: '2024-07-01',
    issueDate: '2024-05-01',
    items: [
      { name: 'Preparación de juicio', hours: 10, rate: 75 },
      { name: 'Audiencia', hours: 5, rate: 75 },
    ],
  },
  {
    id: 3106,
    client: 'Carla',
    caseNumber: '01489-2023',
    amount: '1700,00 US$',
    status: 'Vencida',
    dueDate: '2023-09-01',
    issueDate: '2024-05-01',
    items: [
      { name: 'Consultoría', hours: 12, rate: 80 },
      { name: 'Gestión de documentos', hours: 6, rate: 50 },
    ],
  },
  {
    id: 3107,
    client: 'Luis',
    caseNumber: '02011-2019',
    amount: '2000,00 US$',
    status: 'Pendiente',
    dueDate: '2025-10-15',
    issueDate: '2024-05-01',
    items: [
      { name: 'Representación legal', hours: 15, rate: 90 },
      { name: 'Negociación', hours: 8, rate: 70 },
    ],
  },
];

export const Route = createFileRoute('/InvoicesPage')({
  component: Invoices,
});

function Invoices() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = `${inv.client} ${inv.caseNumber} ${inv.id}`
        .toLowerCase()
        .includes(search.toLowerCase());
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

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  const handleCreateInvoice = (newInvoice: Omit<Invoice, 'id'>) => {
    const newId = invoices.length > 0 ? Math.max(...invoices.map(i => i.id)) + 1 : 1;
    const amountStr =
      typeof newInvoice.amount === 'number' ? newInvoice.amount.toFixed(2) + ' US$' : newInvoice.amount;

    const invoiceToAdd: Invoice = {
      id: newId,
      ...newInvoice,
      amount: amountStr,
    };

    setInvoices((old) => [...old, invoiceToAdd]);
    setIsModalOpen(false);
  };

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
            className="bg-[var(--primary-color)] text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-900 focus:ring-4 focus:ring-blue-600 transition"
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
              className="text-sm border border-gray-300 rounded-md px-3 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
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
              <InvoiceTable invoices={paginatedInvoices} />
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

      {/* Modal para crear nueva factura */}
      <InvoiceCreateModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateInvoice}
      />

      <Footer />
    </div>
  );
}