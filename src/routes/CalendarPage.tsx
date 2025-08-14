import { createFileRoute } from '@tanstack/react-router';
import { Navbar } from '~/components/layout/user/UserNavbar';
import Footer from '~/components/layout/user/UserFooter';
import { CalendarView } from '~/components/Calendar/CalendarView';
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/CalendarPage')({
  component: CalendarPage,
});

function CalendarPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <Navbar />

      {/* Contenido principal */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 sm:px-8 py-8">

        {/* Regresar */}
        <div className="mb-6">
          <a
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-medium">Regresar</span>
          </a>
        </div>

        {/* Card del calendario */}
        <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-100">
          <header className="mb-6 border-b pb-4">
            <h1 className="text-2xl font-semibold text-slate-800">
              Calendario de Actividades
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Consulta tus eventos, citas y recordatorios en un solo lugar.
            </p>
          </header>

          {/* Vista del calendario */}
          <CalendarView />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
