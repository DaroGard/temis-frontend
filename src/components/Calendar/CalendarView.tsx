import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { EventModal } from "./EventModal";
import { EventListModal } from "./EventListModal";
import { useCalendarContext } from "~/components/Calendar/CalendarContext";
import { toast } from "react-hot-toast";

// nombres de los días
const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function CalendarView() {
  // contexto del calendario
  const {
    calendarGrid,
    selectedDate,
    setSelectedDate,
    getEventsForDate,
    currentMonthName,
    currentYear,
    goToNextMonth,
    goToPreviousMonth,
    today,
    goToToday,
    loading,
    events,
  } = useCalendarContext();

  // estados de modales y actualización de celdas
  const [modalOpen, setModalOpen] = useState(false);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [updatedCells, setUpdatedCells] = useState<Record<string, boolean>>({});

  // abrir listado de eventos de un día
  const openEventList = (date: Date) => {
    setSelectedDate(date);
    setListModalOpen(true);
  };

  // actualizar celdas cuando cambian los eventos
  useEffect(() => {
    const newUpdatedCells: Record<string, boolean> = {};
    calendarGrid.forEach(({ date }) => {
      const dateStr = date.toISOString().split("T")[0];
      const cellEvents = getEventsForDate(date);
      if (cellEvents.length) newUpdatedCells[dateStr] = true;
    });
    setUpdatedCells(newUpdatedCells);

    const timeout = setTimeout(() => setUpdatedCells({}), 800);
    return () => clearTimeout(timeout);
  }, [events, calendarGrid, getEventsForDate]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* Header de acciones */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex gap-2">
          <motion.button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-links text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus className="w-5 h-5" />
            Agendar Evento
          </motion.button>

          <motion.button
            onClick={goToToday}
            className="flex items-center gap-2 border px-3 py-2 rounded-lg hover:bg-slate-100 transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <CalendarIcon className="w-4 h-4" /> Hoy
          </motion.button>
        </div>

        {loading && (
          <motion.div className="text-sm text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            Actualizando eventos...
          </motion.div>
        )}
      </div>

      {/* Controles de mes */}
      <div className="flex justify-between items-center mb-4">
        <motion.button onClick={goToPreviousMonth} className="text-slate-600 hover:text-links transition-colors" whileHover={{ scale: 1.2 }}>
          <ChevronLeft />
        </motion.button>
        <h2 className="text-xl font-semibold">{currentMonthName} {currentYear}</h2>
        <motion.button onClick={goToNextMonth} className="text-slate-600 hover:text-links transition-colors" whileHover={{ scale: 1.2 }}>
          <ChevronRight />
        </motion.button>
      </div>

      {/* Header de días */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center font-semibold text-slate-600 bg-slate-100 py-2 rounded">{day}</div>
        ))}
      </div>

      {/* Grid de fechas */}
      <div className="rounded-xl border border-slate-300 shadow-md overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-slate-200">
          {calendarGrid.map(({ date, currentMonth }) => {
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const eventList = getEventsForDate(date);
            const dateStr = date.toISOString().split("T")[0];
            const highlightUpdate = updatedCells[dateStr];

            return (
              <motion.div
                key={date.toISOString()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openEventList(date)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`p-3 h-24 cursor-pointer text-sm transition-colors
                  ${!currentMonth ? 'bg-slate-100 text-slate-400' : 'bg-white hover:bg-blue-50'}
                  ${isToday ? 'border-2 border-links' : 'border'}
                  ${isSelected ? 'bg-blue-100 border-links' : 'border-slate-300'}
                  ${highlightUpdate ? 'bg-green-100' : ''}`}
              >
                <div className="font-medium flex justify-between">
                  {date.getDate()}
                  {isToday && <span className="text-[10px] text-blue-600 font-bold">Hoy</span>}
                </div>

                <ul className="mt-1 space-y-0.5">
                  <AnimatePresence>
                    {eventList.slice(0, 2).map((e, idx) => (
                      <motion.li key={e.id} className="text-[11px] text-links truncate" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }}>
                        📌 {e.event_name}
                      </motion.li>
                    ))}
                    {eventList.length > 2 && (
                      <motion.li className="text-[10px] text-gray-400 italic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                        +{eventList.length - 2} más
                      </motion.li>
                    )}
                  </AnimatePresence>
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <EventModal onClose={() => setModalOpen(false)} defaultDate={selectedDate ?? undefined} editingEvent={null} toast={toast} />
        )}
        {listModalOpen && selectedDate && (
          <EventListModal date={selectedDate} onClose={() => setListModalOpen(false)} toast={toast} />
        )}
      </AnimatePresence>
    </section>
  );
}