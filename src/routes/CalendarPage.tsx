import { createFileRoute } from '@tanstack/react-router';
import { Navbar } from '~/components/layout/user/UserNavbar';
import Footer from '~/components/layout/user/UserFooter';
import { CalendarView } from '~/components/Calendar/CalendarView';

import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/CalendarPage')({
  component: CalendarPage,
});

function CalendarPage() {
  return (
    <div>

      <div className="min-h-screen flex flex-col bg-white text-slate-900">
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
        <main className="flex-grow">
          <CalendarView />
        </main>
        <Footer />
      </div>
    </div>
  );
}