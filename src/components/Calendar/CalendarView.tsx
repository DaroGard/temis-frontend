import React, { useState } from 'react';
import { EventModal } from './EventModal';
import { useCalendar } from '~/types/useCalendar';
import { motion } from 'framer-motion';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function CalendarView() {
  const {
    calendarGrid,
    events,
    selectedDate,
    setSelectedDate,
    getEventsForDate,
    currentMonthName,
    currentYear,
    goToNextMonth,
    goToPreviousMonth,
    today,
  } = useCalendar();

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendario</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agendar Evento
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPreviousMonth} className="text-slate-600 hover:text-blue-600">
          <ChevronLeft />
        </button>
        <h2 className="text-xl font-semibold">{currentMonthName} {currentYear}</h2>
        <button onClick={goToNextMonth} className="text-slate-600 hover:text-blue-600">
          <ChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-slate-600 bg-slate-100 py-2 rounded"
          >
            {day}
          </div>
        ))}
      </div>

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
                onClick={() => setSelectedDate(date)}
                className={`p-3 h-24 cursor-pointer text-sm transition-colors bg-white
                  ${!currentMonth ? 'bg-slate-100 text-slate-400' : ''}
                  ${isToday ? 'border-2 border-blue-500' : 'border'}
                  ${isSelected ? 'bg-blue-100 border-blue-600' : 'border-slate-300'}
                `}
              >
                <div className="font-medium">{date.getDate()}</div>
                {eventList.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {eventList.slice(0, 2).map((e) => (
                      <li key={e.id} className="text-[11px] text-blue-600 truncate">
                        📌 {e.title}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {modalOpen && (
        <EventModal
          onClose={() => setModalOpen(false)}
          defaultDate={selectedDate ?? undefined}
        />
      )}
    </section>
  );
}
