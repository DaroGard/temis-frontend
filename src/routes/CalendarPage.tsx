import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "~/components/layout/user/UserNavbar";
import Footer from "~/components/layout/user/UserFooter";
import { CalendarView } from "~/components/Calendar/CalendarView";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { CalendarProvider } from "~/components/Calendar/CalendarContext";

export const Route = createFileRoute("/CalendarPage")({
  component: CalendarPage,
});

function CalendarPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* navbar */}
      <Navbar />

      {/* contenido principal */}
      <motion.main
        className="flex-grow max-w-7xl w-full mx-auto px-6 sm:px-8 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* regresar */}
        <div className="mb-6 flex items-center gap-4">
          <motion.a
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-700 font-medium transition-all duration-200 hover:shadow-md hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Regresar
          </motion.a>
        </div>

        {/* proveedor del calendario */}
        <CalendarProvider>
          <motion.section
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-100"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* header del calendario */}
            <header className="mb-6 border-b pb-4">
              <h1 className="text-2xl font-semibold text-slate-800">Calendario de Actividades</h1>
              <p className="text-slate-500 mt-1 text-sm">Consulta tus eventos, citas y recordatorios en un solo lugar.</p>
            </header>

            {/* vista del calendario */}
            <CalendarView />
          </motion.section>
        </CalendarProvider>
      </motion.main>

      {/* footer */}
      <Footer />
    </div>
  );
}