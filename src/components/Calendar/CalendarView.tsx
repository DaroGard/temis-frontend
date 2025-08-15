import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { EventModal } from './EventModal';
import { EventListModal } from './EventListModal';
import { useCalendar } from '~/types/useCalendar';
import { toast } from 'react-hot-toast';

const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function CalendarView() {
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
  } = useCalendar();

  const [modalOpen, setModalOpen] = useState(false);
  const [listModalOpen, setListModalOpen] = useState(false);

  const openEventList = (date: Date) => {
    setSelectedDate(date);
    setListModalOpen(true);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-links text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Agendar Evento
          </button>
          <button
            onClick={goToToday}
            className="flex items-center gap-2 border px-3 py-2 rounded hover:bg-slate-100"
          >
            <CalendarIcon className="w-4 h-4" /> Hoy
          </button>
        </div>
      </div>

      {/* Meses */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPreviousMonth} className="text-slate-600 hover:text-links">
          <ChevronLeft />
        </button>
        <h2 className="text-xl font-semibold">
          {currentMonthName} {currentYear}
        </h2>
        <button onClick={goToNextMonth} className="text-slate-600 hover:text-links">
          <ChevronRight />
        </button>
      </div>

      {/* Dias */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div
            key={day}
            className="text-center font-semibold text-slate-600 bg-slate-100 py-2 rounded"
          >
            {day}
          </div>
        ))}
      </div>

      {/* grid */}
      <div className="rounded-xl border border-slate-300 shadow-md overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-slate-200">
          {calendarGrid.map(({ date, currentMonth }) => {
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const eventList = getEventsForDate(date);

            return (
              <motion.div
                key={date.toISOString()}
                whileHover={{ scale: 1.02 }}
                onClick={() => openEventList(date)}
                className={`p-3 h-24 cursor-pointer text-sm bg-white transition-colors
                  ${!currentMonth ? 'bg-slate-100 text-slate-400' : ''}
                  ${isToday ? 'border-2 border-links' : 'border'}
                  ${isSelected ? 'bg-blue-100 border-links' : 'border-slate-300'}
                `}
              >
                <div className="font-medium">{date.getDate()}</div>
                {eventList.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {eventList.slice(0, 2).map(e => (
                      <li key={e.id} className="text-[11px] text-links truncate">
                        📌 {e.event_name}
                      </li>
                    ))}
                    {eventList.length > 2 && (
                      <li className="text-[10px] text-gray-400 italic">
                        +{eventList.length - 2} más
                      </li>
                    )}
                  </ul>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {modalOpen && (
        <EventModal
          onClose={() => setModalOpen(false)}
          defaultDate={selectedDate ?? undefined}
          editingEvent={null}
          toast={toast}
        />
      )}
      {listModalOpen && selectedDate && (
        <EventListModal
          date={selectedDate}
          onClose={() => setListModalOpen(false)}
          toast={toast}
        />
      )}
    </section>
  );
}