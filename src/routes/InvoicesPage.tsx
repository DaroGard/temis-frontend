import { createFileRoute } from '@tanstack/react-router';
import React, { useState } from 'react';
import { Navbar } from '~/components/layout/user/UserNavbar';
import Footer from '~/components/layout/user/UserFooter';

import { InvoiceTable } from '~/components/invoice/InvoiceTable';
import { SearchBar } from '~/components/invoice/SearchBar';
import { Button } from '~/components/generals/button';
import type { Invoice } from '~/types/invoice';

const mockInvoices: Invoice[] = [
    { id: 3100, client: 'Horn', caseNumber: '02215-2018', amount: '1100,00 US$', status: 'Pendiente', dueDate: '2024-06-15' },
    { id: 3101, client: 'Guillermo', caseNumber: '03456-2024', amount: '1300,00 US$', status: 'Pagada', dueDate: '2024-06-20' },
    { id: 3102, client: 'Maria', caseNumber: '01789-2023', amount: '2500,00 US$', status: 'Vencida', dueDate: '2023-05-30' },
    { id: 3103, client: 'David', caseNumber: '02418-2025', amount: '1400,00 US$', status: 'Pendiente', dueDate: '2024-07-11' },
    { id: 3104, client: 'Jose', caseNumber: '06275-2020', amount: '1000,00 US$', status: 'Pendiente', dueDate: '2025-08-16' },
    { id: 3105, client: 'Lucas', caseNumber: '01235-2021', amount: '1500,00 US$', status: 'Pagada', dueDate: '2024-07-01' },
    { id: 3106, client: 'Carla', caseNumber: '01489-2023', amount: '1700,00 US$', status: 'Vencida', dueDate: '2023-09-01' },
    { id: 3107, client: 'Luis', caseNumber: '02011-2019', amount: '2000,00 US$', status: 'Pendiente', dueDate: '2025-10-15' },
];

export const Route = createFileRoute('/InvoicesPage')({
    component: Invoices,
});

function Invoices() {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredInvoices = mockInvoices.filter(inv =>
        `${inv.client} ${inv.caseNumber} ${inv.id}`.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const paginatedInvoices = filteredInvoices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="bg-[#f4f6f8] min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow">
                <div className="bg-white px-8 py-6 shadow-sm flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-black">Facturas</h1>
                        <p className="text-gray-500 text-sm">Gestiona la facturación de tus casos</p>
                    </div>
                    <Button className="bg-[var(--primary-color)] text-white px-6 py-2 rounded-md hover:bg-blue-900 shadow">
                        + Nueva Factura
                    </Button>
                </div>
                <div className="px-8 py-6 space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <SearchBar onSearch={setSearch} className="flex-1 min-w-[300px]" />
                        <div className="flex gap-2">
                            <select className="text-sm border rounded-md px-3 py-2 text-gray-600 shadow-sm">
                                <option value="">Todos los estados</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Pagada">Pagada</option>
                                <option value="Vencida">Vencida</option>
                            </select>
                            <Button variant="outline" className="text-sm border px-4 py-2">
                                Filtros
                            </Button>
                        </div>
                    </div>
                    <InvoiceTable invoices={paginatedInvoices} />
                    <div className="flex justify-center items-center gap-4 pt-4">
                        <Button
                            variant="outline"
                            className="px-4 py-2"
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </Button>
                        <span className="text-sm text-gray-700">
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            className="px-4 py-2"
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}