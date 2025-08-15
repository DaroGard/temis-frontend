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

// Importar el servicio
import { casesService } from "~/services/casesService";

const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'activo', label: 'Activo' },
    { value: 'victoria', label: 'Victoria (Ganado)' },
    { value: 'derrota', label: 'Derrota (Perdido)' },
    { value: 'conciliacion', label: 'Conciliación' },
];

const CasosPage = () => {
    const [metrics, setMetrics] = useState<CasesMetrics | null>(null);
    const [cases, setCases] = useState<LegalCase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [caseToEdit, setCaseToEdit] = useState<LegalCase | null>(null);

    const navigate = useNavigate();

    // Cargar datos desde la API
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Cargar casos y métricas en paralelo
                const [casesData, metricsData] = await Promise.all([
                    casesService.getAllCases(),
                    casesService.getCasesMetrics().catch(() => null) // No fallar si las métricas fallan
                ]);

                // Convertir casos del backend al formato del frontend
                const convertedCases = casesService.convertCasesSummary(casesData);
                setCases(convertedCases);

                // Establecer métricas si se cargaron correctamente
                if (metricsData) {
                    setMetrics(metricsData);
                }

            } catch (err: any) {
                setError(err.message || 'Error al cargar datos');
                console.error('Error loading data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
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

    async function handleSave(updatedData: Partial<LegalCase>) {
        if (!caseToEdit) return;

        try {
            // Actualizar en el backend usando el endpoint correcto
            const backendResponse = await casesService.updateCase(caseToEdit.id, {
                title: updatedData.title,
                case_type: updatedData.case_type,
                status: updatedData.status,
                priority_level: updatedData.priority_level,
                description: updatedData.description,
                notes: updatedData.notes,
                start_date: updatedData.start_date,
                end_date: updatedData.end_date,
            });

            // Convertir la respuesta del backend al formato del frontend
            const convertedResponse = casesService.convertBackendToFrontend(backendResponse);

            // Actualizar estado local con los datos reales del backend
            setCases((prevCases) =>
                prevCases.map(c =>
                    c.id === caseToEdit.id ? convertedResponse : c
                )
            );

            setModalOpen(false);
            setCaseToEdit(null);

            console.log('✅ Caso actualizado exitosamente en el backend y frontend sincronizado');

        } catch (error: any) {
            console.error('Error al actualizar caso:', error);
            // Solo actualizar localmente si falla el backend
            setCases((prevCases) =>
                prevCases.map(c =>
                    c.id === caseToEdit.id ? { ...c, ...updatedData } : c
                )
            );
            setModalOpen(false);
            setCaseToEdit(null);

            alert('Los cambios se guardaron localmente pero no se pudieron sincronizar con el servidor: ' + error.message);
        }
    }

    const handleRetry = () => {
        window.location.reload();
    };

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

                {/* Manejo de errores */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-warning font-medium">Error al cargar datos</h3>
                                <p className="text-red-600 text-sm mt-1">{error}</p>
                            </div>
                            <Button
                                onClick={handleRetry}
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                                Reintentar
                            </Button>
                        </div>
                    </div>
                )}

                {/* Métricas */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 animate-pulse">
                                <div className="h-12 bg-gray-200 rounded-full w-12 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-16"></div>
                            </div>
                        ))}
                    </div>
                ) : metrics ? (
                    <CasesMetricsCards metrics={metrics} />
                ) : !error && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-yellow-800">No se pudieron cargar las métricas</p>
                    </div>
                )}

                {/* Filtros y búsqueda */}
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

                {/* Lista de casos */}
                <div className="mt-8">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 animate-pulse">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                    </div>
                                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                    <div className="space-y-2 mb-4">
                                        <div className="h-3 bg-gray-200 rounded"></div>
                                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                    <div className="flex space-x-3">
                                        <div className="h-8 bg-gray-200 rounded flex-grow"></div>
                                        <div className="h-8 bg-gray-200 rounded flex-grow"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredCases.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                {cases.length === 0 && !error ? (
                                    <>
                                        <p className="text-slate-500 text-lg mb-4">No tienes casos creados aún</p>
                                        <Button
                                            onClick={() => navigate({ to: "/newCase" })}
                                            className="inline-flex items-center gap-2"
                                        >
                                            <Plus size={20} />
                                            Crear tu primer caso
                                        </Button>
                                    </>
                                ) : (
                                    <p className="text-slate-500 text-lg">
                                        No se encontraron casos que coincidan con los filtros aplicados.
                                    </p>
                                )}
                            </div>
                        </div>
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

                {/* Información adicional */}
                {!loading && cases.length > 0 && (
                    <div className="mt-8 text-center text-sm text-slate-500">
                        Mostrando {filteredCases.length} de {cases.length} casos
                    </div>
                )}
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