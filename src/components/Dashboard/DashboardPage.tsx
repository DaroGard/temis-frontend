import { useState, useEffect } from 'react';
import MetricsCards from './MetricsCards';
import CasesSection from './CasesSection';
import InvoicesSection from './InvoicesSection';
import AgendaSection from './AgendaSection';
import RecentActivity from './RecentActivity';
import { Navbar } from '~/components/layout/user/UserNavbar';
import Footer from '~/components/layout/user/UserFooter';

const mockData = {
  user: {
    id: 1,
    username: "abogado1",
    first_name: "María",
    last_name: "González",
    email: "maria@bufete.com"
  },
  metrics: {
    activeCases: 24,
    pendingInvoices: 8,
    todayAppointments: 3,
    urgentTasks: 5
  },
  recentCases: [
    {
      id: 1,
      case_number: "2024-001",
      client_name: "María González",
      case_type: "Civil",
      status: "active" as const
    },
    {
      id: 2,
      case_number: "2024-002",
      client_name: "Juan Pérez",
      case_type: "Comercial",
      status: "pending" as const
    }
  ],
  recentInvoices: [
    {
      id: 1,
      invoice_number: "#f-2024-045",
      client_name: "María González",
      amount: "L 2,500",
      status: "pending" as const
    },
    {
      id: 2,
      invoice_number: "#f-2024-046",
      client_name: "Carlos López",
      amount: "L 1,800",
      status: "paid" as const
    }
  ],
  todayAgenda: [
    {
      id: 1,
      time: "14:00",
      title: "Audiencia Civil",
      location: "Juzgado 5to circuito",
      type: "audiencia" as const
    },
    {
      id: 2,
      time: "16:30",
      title: "Consulta inicial",
      location: "Oficina principal",
      type: "consulta" as const
    }
  ],
  recentActivity: [
    {
      id: "1",
      type: "document" as const,
      title: "Documento subido al caso #2024-001",
      timestamp: "2 horas",
      description: "Contrato de arrendamiento actualizado"
    },
    {
      id: "2",
      type: "invoice" as const,
      title: "Factura #f-2024-045 generada",
      timestamp: "4 horas",
      description: "Factura enviada a María González"
    },
    {
      id: "3",
      type: "appointment" as const,
      title: "Cita programada para mañana",
      timestamp: "6 horas",
      description: "Reunión con nuevo cliente"
    }
  ]
};

const Dashboard = () => {
  const [data, setData] = useState(mockData);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // fetchDashboardData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // logica
    console.log('Searching for:', query);
  };

  const handleViewAllCases = () => {
    console.log('Navigate to all cases');
  };

  const handleViewAllInvoices = () => {
    console.log('Navigate to all invoices');
  };

  const handleViewCalendar = () => {
    console.log('Navigate to calendar');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <Navbar 
        //userName={`${data.user.first_name} ${data.user.last_name}`}
        //onSearch={handleSearch}
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
            Bienvenido(a) Abogado
          </h1>
          <p className="text-slate-600">
            Aquí tienes un resumen de tu actividad legal del día
          </p>
        </div>

        {/* Metrics Cards */}
        <MetricsCards metrics={data.metrics} />

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Cases Section */}
          <CasesSection 
            cases={data.recentCases}
            onViewAll={handleViewAllCases}
          />

          {/* Invoices Section */}
          <InvoicesSection 
            invoices={data.recentInvoices}
            onViewAll={handleViewAllInvoices}
          />

          {/* Agenda Section */}
          <AgendaSection 
            agendaItems={data.todayAgenda}
            onViewCalendar={handleViewCalendar}
          />
        </div>

        {/* Recent Activity Section */}
        <div className="max-w-9xl">
          <RecentActivity activities={data.recentActivity} />
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default Dashboard;