import { useState, useEffect } from 'react';
import MetricsCards from './MetricsCards';
import CasesSection from './CasesSection';
import InvoicesSection from './InvoicesSection';
import AgendaSection from './AgendaSection';
import RecentActivity from './RecentActivity';
import { Navbar } from '~/components/layout/user/UserNavbar';
import Footer from '~/components/layout/user/UserFooter';

// Importar hooks del servicio API
import {
  useDashboardMetrics,
  useRecentCases,
  useRecentInvoices,
  useUserProfile,
  useBackendStatus,
  useTodayAgenda,
  dashboardApiService
} from '~/services/dashboardApiService';

// Importar tipos
import type { DashboardCase, DashboardInvoice, DashboardMetrics } from '~/types/dashboard';

// Funciones para transformar datos del backend al formato que esperan los componentes
const transformCasesForDashboard = (cases: DashboardCase[]) => {
  return cases.map(case_ => ({
    id: case_.id,
    case_number: case_.case_number,
    client_name: case_.client_name,
    case_type: case_.case_type,
    status: case_.status.toLowerCase() as 'active' | 'pending' | 'closed'
  }));
};

const transformInvoicesForDashboard = (invoices: DashboardInvoice[]) => {
  return invoices.map(invoice => ({
    id: invoice.id,
    invoice_number: `#f-${invoice.invoice_number}`,
    client_name: invoice.client_name,
    amount: `L ${invoice.total_amount.toFixed(2)}`,
    status: invoice.status.toLowerCase() === 'pendiente' ? 'pending' as const :
      invoice.status.toLowerCase() === 'pagada' ? 'paid' as const : 'overdue' as const
  }));
};

const transformMetricsForDashboard = (metrics: DashboardMetrics) => {
  return {
    activeCases: metrics.active_cases,
    pendingInvoices: metrics.pending_invoices,
    todayAppointments: metrics.today_appointments,
    urgentTasks: metrics.urgent_tasks
  };
};

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Hooks para datos del backend
  const { metrics, loading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useDashboardMetrics();
  const { cases, loading: casesLoading, error: casesError, refetch: refetchCases } = useRecentCases(2);
  const { invoices, loading: invoicesLoading, error: invoicesError, refetch: refetchInvoices } = useRecentInvoices(2);
  const { agendaItems, loading: agendaLoading, error: agendaError, refetch: refetchAgenda } = useTodayAgenda();
  const { profile, loading: profileLoading } = useUserProfile();
  const backendStatus = useBackendStatus();

  // Datos mock para actividad reciente (hasta que implementes esta funcionalidad)
  const mockActivity = [
    {
      id: "1",
      type: "document" as const,
      title: "Documento subido al caso",
      timestamp: "2 horas",
      description: "Contrato de arrendamiento actualizado"
    },
    {
      id: "2",
      type: "invoice" as const,
      title: "Factura generada",
      timestamp: "4 horas",
      description: "Factura enviada a cliente"
    }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Searching for:', query);
  };

  const handleRefreshAll = async () => {
    await Promise.all([
      refetchMetrics(),
      refetchCases(),
      refetchInvoices(),
      refetchAgenda()
    ]);
  };

  const handleViewAllCases = () => {
    console.log('Navigate to all cases');
    // TODO: Navegar a la página de casos
  };

  const handleViewAllInvoices = () => {
    console.log('Navigate to all invoices');
    // TODO: Navegar a la página de facturas
  };

  const handleViewCalendar = () => {
    console.log('Navigate to calendar');
    // TODO: Navegar al calendario
  };

  // Loading state
  const isLoading = metricsLoading || casesLoading || invoicesLoading || profileLoading || agendaLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-links mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <Navbar />

      {/* Backend Status Indicator */}
      {backendStatus !== 'online' && (
        <div className="bg-red-100 border-l-4 border-warning text-red-700 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm">
                ⚠️ Problemas de conexión con el servidor. Algunos datos pueden no estar actualizados.
                <button
                  onClick={handleRefreshAll}
                  className="ml-2 underline hover:no-underline"
                >
                  Reintentar
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
            Bienvenido(a) {profile ? `${profile.first_name} ${profile.last_name}` : 'Abogado'}
          </h1>
          <p className="text-slate-600">
            Aquí tienes un resumen de tu actividad legal del día
            {backendStatus === 'online' && (
              <span className="text-green-600 ml-2">• Datos en tiempo real</span>
            )}
          </p>
        </div>

        {/* Error Messages */}
        {(metricsError || casesError || invoicesError || agendaError) && (
          <div className="mb-6 space-y-2">
            {metricsError && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-red-600 text-sm">
                Error en métricas: {metricsError}
              </div>
            )}
            {casesError && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-red-600 text-sm">
                Error en casos: {casesError}
              </div>
            )}
            {invoicesError && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-red-600 text-sm">
                Error en facturas: {invoicesError}
              </div>
            )}
            {agendaError && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-red-600 text-sm">
                Error en agenda: {agendaError}
              </div>
            )}
          </div>
        )}

        {/* Refresh Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleRefreshAll}
            disabled={isLoading}
            className="bg-links text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? '🔄 Actualizando...' : '🔄 Actualizar datos'}
          </button>
        </div>

        {/* Metrics Cards */}
        {metrics ? (
          <MetricsCards metrics={transformMetricsForDashboard(metrics)} />
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-pending">No se pudieron cargar las métricas</p>
          </div>
        )}

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col">
            <CasesSection
              cases={cases ? transformCasesForDashboard(cases) : []}
              onViewAll={handleViewAllCases}
            />
          </div>

          <div className="flex flex-col">
            <InvoicesSection
              invoices={invoices ? transformInvoicesForDashboard(invoices) : []}
              onViewAll={handleViewAllInvoices}
            />
          </div>

          <div className="flex flex-col">
            <AgendaSection
              agendaItems={agendaItems ? agendaItems.slice(0, 2) : []}
              onViewCalendar={handleViewCalendar}
            />
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="max-w-9xl">
          <RecentActivity activities={mockActivity} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;