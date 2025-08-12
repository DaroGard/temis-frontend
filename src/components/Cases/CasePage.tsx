import React, { useEffect, useState, useMemo } from "react";
import { Plus, Search, Filter, ArrowLeft } from "lucide-react";
import { Navbar } from "~/components/layout/user/UserNavbar";
import Footer from "~/components/layout/user/UserFooter";
import CasesMetricsCards from "./CaseStatsCards";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/Select";
import { Button } from "../generals/button";
import { CasesMetrics, LegalCase } from '~/types/cases';
import CaseCard from '~/components/Cases/CaseCard';
import { useNavigate } from "@tanstack/react-router";

import CaseEditModal from '~/components/Cases/CaseDetail/CaseEditModal';

const mockMetrics: CasesMetrics = {
    total: 24,
    active: 12,
    urgent: 3,
    pending: 9,
};

const mockCasesData: LegalCase[] = [
    {
        id: 1,
        title: 'Divorcio – Familia García',
        case_number: 'FAM-2023-001',
        case_type: 'Divorcio',
        start_date: '2023-05-01',
        end_date: '',
        status: 'pendiente',
        priority_level: 'alta',
        description: 'Proceso de divorcio con custodia compartida en disputa.',
        notes: 'Cliente requiere actualizaciones semanales.',
        client: {
            id: 0,
            name: 'María García',
            dni: '0801-1990-12345',
            email: 'maria.garcia@example.com',
            phone_1: '9999-1234',
            phone_2: '',
            address: 'Col. Centro, Tegucigalpa',
        },
        account_id: 0,
        client_id: 0,
    },
    {
        id: 2,
        title: 'Reclamación de herencia – Familia López',
        case_number: 'HER-2023-002',
        case_type: 'Herencia',
        start_date: '2023-03-15',
        end_date: '',
        status: 'activo',
        priority_level: 'media',
        description: 'Disputa por la repartición de bienes familiares.',
        notes: 'Reuniones mensuales programadas con cliente.',
        client: {
            id: 1,
            name: 'Carlos López',
            dni: '0801-1985-98765',
            email: 'carlos.lopez@example.com',
            phone_1: '8888-5678',
            phone_2: '7777-1234',
            address: 'Col. La Rivera, San Pedro',
        },
        account_id: 0,
        client_id: 1,
    },
    {
        id: 3,
        title: 'Contrato de arrendamiento – Empresa XYZ',
        case_number: 'CON-2023-003',
        case_type: 'Contrato',
        start_date: '2023-01-20',
        end_date: '2023-12-31',
        status: 'cerrado',
        priority_level: 'baja',
        description: 'Renovación y revisión del contrato de arrendamiento.',
        notes: '',
        client: {
            id: 2,
            name: 'Empresa XYZ',
            dni: '',
            email: 'contacto@empresaxyz.com',
            phone_1: '6666-9999',
            phone_2: '',
            address: 'Av. Central 123, Tegucigalpa',
        },
        account_id: 0,
        client_id: 2,
    },
    {
        id: 4,
        title: 'Asesoría legal – Startup Innovatech',
        case_number: 'ASE-2023-004',
        case_type: 'Asesoría',
        start_date: '2023-06-10',
        end_date: '',
        status: 'urgente',
        priority_level: 'alta',
        description: 'Asesoría en temas legales para lanzamiento de producto.',
        notes: 'Reuniones diarias durante la primera semana.',
        client: {
            id: 3,
            name: 'Innovatech S.A.',
            dni: '',
            email: 'legal@innovatech.com',
            phone_1: '5555-4321',
            phone_2: '5555-4322',
            address: 'Parque Industrial, Tegucigalpa',
        },
        account_id: 0,
        client_id: 3,
    },
];

const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'activo', label: 'Activo' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'urgente', label: 'Urgente' },
    { value: 'cerrado', label: 'Cerrado' },
];

const CasosPage = () => {
    const [metrics, setMetrics] = useState<CasesMetrics | null>(null);
    const [cases, setCases] = useState<LegalCase[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [caseToEdit, setCaseToEdit] = useState<LegalCase | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setMetrics(mockMetrics);
            setCases(mockCasesData);
            setLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredCases = useMemo(() => {
        if (loading) return [];

        return cases.filter(c => {
            const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;

            if (!matchesStatus) return false;

            if (!normalizedSearch) return true;

            const title = c.title.toLowerCase();
            const clientName = c.client?.name.toLowerCase() || '';
            const caseNumber = c.case_number.toLowerCase();
            const caseType = c.case_type.toLowerCase();
            const description = c.description.toLowerCase();
            const notes = c.notes.toLowerCase();

            return (
                title.includes(normalizedSearch) ||
                clientName.includes(normalizedSearch) ||
                caseNumber.includes(normalizedSearch) ||
                caseType.includes(normalizedSearch) ||
                description.includes(normalizedSearch) ||
                notes.includes(normalizedSearch)
            );
        });
    }, [cases, selectedStatus, normalizedSearch, loading]);

    function handleEditClick(caseItem: LegalCase) {
        setCaseToEdit(caseItem);
        setModalOpen(true);
    }

    function handleSave(updatedData: Partial<LegalCase>) {
        if (!caseToEdit) return;
        setCases((prevCases) =>
            prevCases.map(c =>
                c.id === caseToEdit.id ? { ...c, ...updatedData } : c
            )
        );
        setModalOpen(false);
        setCaseToEdit(null);
    }

    return (
        <div className="min-h-screen bg-slate-50">
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
            <main className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Casos</h1>
                        <p className="text-slate-600">Gestiona todos los casos legales</p>
                    </div>
                    <Button
                        variant="default"
                        size="default"
                        onClick={() => navigate({ to: "/newCase" })}
                        className="flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus size={20} />
                        Nuevo Caso
                    </Button>
                </div>

                {loading ? (
                    <p className="text-slate-500">Cargando métricas...</p>
                ) : metrics ? (
                    <CasesMetricsCards metrics={metrics} />
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
                    <Select
                        placeholder="Todos los estados"
                        options={statusOptions}
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full md:w-auto"
                    />

                    <Button variant="outline" size="default" className="w-full md:w-auto">
                        <Filter className="mr-2" size={20} />
                        Filtros
                    </Button>
                </div>

                <div className="mt-8">
                    {!loading && cases.length === 0 && (
                        <p className="text-slate-500 text-center">No hay casos disponibles.</p>
                    )}

                    {loading ? (
                        <p className="text-slate-500 text-center">Cargando casos...</p>
                    ) : filteredCases.length === 0 ? (
                        <p className="text-slate-500 text-center">No se encontraron casos que coincidan con los filtros.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCases.map((caseItem) => (
                                <CaseCard
                                    key={caseItem.id}
                                    caseItem={caseItem}
                                    onEdit={handleEditClick}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />

            {/* Modal de edición */}
            {caseToEdit && (
                <CaseEditModal
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setCaseToEdit(null);
                    }}
                    caseData={caseToEdit}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default CasosPage;