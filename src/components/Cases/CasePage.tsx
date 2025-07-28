// pages/CasosPage.tsx
import { useEffect, useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Navbar } from "~/components/layout/user/UserNavbar";
import Footer from "~/components/layout/user/UserFooter";

import CasesMetricsCards from "./CaseStatsCards"; // Asegura la ruta correcta
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/Select";
import { Button } from "../generals/button"; // Asegura la ruta correcta

import { CasesMetrics } from "~/types/cases";
import { LegalCase, Client } from '~/types/cases'
import CaseCard from '~/components/Cases/CaseCard'

const mockData = {
    metrics: {
        total: 24,
        active: 12,
        urgent: 3,
        pending: 9,
    } satisfies CasesMetrics,
};

const mockCasesData: LegalCase[] = [
    {
        id: 1,
        case_number: '2024-001',
        title: 'Demanda Laboral - Spectre vs Litt',
        start_date: '2025-06-12',
        case_type: 'Civil',
        account_id: 101,
        client_id: 201,
        description: 'Demanda de exempleado por despido injustificado.',
        priority_level: 'high',
        notes: 'Preparar alegatos finales.',
        status: 'active',
        client: { id: 201, name: 'María González', dni: '0801199012345', email: 'maria@example.com', phone_1: '123-456-7890', address: 'Calle Falsa 123' }
    },
    {
        id: 2,
        title: 'Divorcio - Pérez vs López',
        case_number: '2024-002',
        case_type: 'Familiar',
        start_date: '2024-06-18',
        account_id: 102,
        client_id: 202,
        description: 'Proceso de divorcio de mutuo acuerdo.',
        priority_level: 'medium',
        notes: 'Esperando firma de documentos.',
        status: 'pending',
        client: { id: 202, name: 'Juan Pérez', dni: '0802198567890', email: 'juan@example.com', phone_1: '098-765-4321', address: 'Avenida Siempre Viva 742' }
    },
    {
        id: 3,
        case_number: '2024-003',
        title: 'Contrato Inmobiliario - ACME Corp.',
        start_date: '2025-06-25',
        case_type: 'Mercantil',
        account_id: 103,
        client_id: 203,
        description: 'Revisión y negociación de contrato de compraventa.',
        priority_level: 'high',
        notes: 'Urgente, fecha de cierre próxima.',
        status: 'urgent',
        client: { id: 203, name: 'ACME Corporation', dni: '0803197011223', email: 'acme@example.com', phone_1: '555-123-4567', address: 'Zona Industrial 45' }
    },
    {
        id: 4,
        case_number: '2024-004',
        title: 'Sucesión - Familia Rivera',
        start_date: '2024-07-01',
        case_type: 'Civil',
        account_id: 104,
        client_id: 204,
        description: 'Gestión de herencia y partición de bienes.',
        priority_level: 'low',
        notes: 'Junta de herederos programada.',
        status: 'active',
        client: { id: 204, name: 'Pedro Rivera', dni: '0804199544556', email: 'pedro@example.com', phone_1: '777-888-9999', address: 'Calle Ancha 8' }
    },
    {
        id: 5,
        case_number: '2024-005',
        title: 'Accidente de Tráfico - García',
        start_date: '2024-07-05',
        case_type: 'Penal',
        account_id: 105,
        client_id: 205,
        description: 'Defensa por accidente de tráfico con lesiones.',
        priority_level: 'high',
        notes: 'Esperando informe pericial.',
        status: 'pending',
        client: { id: 205, name: 'Ana García', dni: '0805198877889', email: 'ana@example.com', phone_1: '111-222-3333', address: 'Bulevar Central 10' }
    },
    {
        id: 6,
        case_number: '2024-006',
        title: 'Disputa de Propiedad - Vecinos',
        start_date: '2024-05-10',
        case_type: 'Civil',
        account_id: 106,
        client_id: 206,
        description: 'Litigio entre vecinos por límites de propiedad.',
        priority_level: 'low',
        notes: 'Caso cerrado y archivado.',
        status: 'closed',
        client: { id: 206, name: 'Familia Díaz', dni: '0806197500112', email: 'diaz@example.com', phone_1: '444-555-6666', address: 'Colonia La Paz 7' }
    },
];

const CasosPage = () => {
    const [data, setData] = useState<{ metrics: CasesMetrics } | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [cases, setCases] = useState<LegalCase[]>([]);

    useEffect(() => {
        const metricsTimeout = setTimeout(() => {
            setData(mockData);
            setLoading(false);
        }, 1000);

        const casesTimeout = setTimeout(() => {
            setCases(mockCasesData);
        }, 1200);

        return () => {
            clearTimeout(metricsTimeout);
            clearTimeout(casesTimeout);
        };
    }, []);

    const filteredCases = cases.filter(caseItem => {
        const matchesSearchTerm = searchTerm.toLowerCase() === '' ||
        caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (caseItem.client?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.case_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.notes.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus === 'all' || caseItem.status === selectedStatus;

        return matchesSearchTerm && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

        <main className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Casos</h1>
                    <p className="text-slate-600">Gestiona todos los casos legales</p>
                </div>
            </div>

            {loading ? (
                <p className="text-slate-500">Cargando métricas...</p>
            ) : data ? (
                    <CasesMetricsCards metrics={data.metrics} />
                ) : (
                <p className="text-red-500">Error al cargar los datos</p>
            )}

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                    <Input
                        type="text"
                        placeholder="Buscar casos, clientes, documentos..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>

                {/* CAMBIO: Usar tu componente Select en lugar de Dropdown */}
                <Select // <--- Usamos el componente Select que me proporcionaste
                    placeholder="Todos los estados"
                    options={[
                        { value: 'all', label: 'Todos los estados' },
                        { value: 'active', label: 'Activo' },
                        { value: 'pending', label: 'Pendiente' },
                        { value: 'urgent', label: 'Urgente' },
                        { value: 'closed', label: 'Cerrado' },
                    ]}
                    value={selectedStatus}
                    // Aquí capturamos el evento del select nativo y extraemos el valor
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
                    className="w-full md:w-auto"
                />

                <Button variant="outline" size="default" className="w-full md:w-auto">
                    <Filter className="mr-2" size={20} />
                        Filtros
                </Button>
            </div>

            {/* Sección de la Lista de Casos */}
            <div className="mt-8">
                {cases.length === 0 && !loading && <p className="text-slate-500 text-center">No hay casos disponibles.</p>}
                {loading ? (
                    <p className="text-slate-500 text-center">Cargando casos...</p>
                ) : filteredCases.length === 0 ? (
                    <p className="text-slate-500 text-center">No se encontraron casos que coincidan con los filtros.</p>
                ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCases.map((caseItem) => (
                                <CaseCard key={caseItem.id} caseItem={caseItem} />
                            ))}
                        </div>
                    )}
            </div>

        </main>

        <Footer />
    </div>
    );
};

export default CasosPage;