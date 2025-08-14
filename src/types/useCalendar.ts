import { useState } from 'react';

export interface CalendarEvent {
  id: string;
  account_id: string;
  user_id: string;
  event_name: string;
  due_date: string;
  tags: string[];
}

function getDaysInMonth(year: number, month: number) {
  const date = new Date(year, month, 1);
  const days = [];

  const startDay = date.getDay();
  const prevMonthDays = startDay === 0 ? 6 : startDay - 1;

  for (let i = prevMonthDays; i > 0; i--) {
    const d = new Date(year, month, 1 - i);
    days.push({ date: d, currentMonth: false });
  }

  while (date.getMonth() === month) {
    days.push({ date: new Date(date), currentMonth: true });
    date.setDate(date.getDate() + 1);
  }

  const nextDays = 42 - days.length;
  for (let i = 0; i < nextDays; i++) {
    const d = new Date(year, month + 1, i + 1);
    days.push({ date: d, currentMonth: false });
  }

  return days;
}

export function useCalendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);

  // Estado para eventos
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      account_id: 'acc_001',
      user_id: 'usr_123',
      event_name: 'Audiencia Civil',
      due_date: today.toISOString().split('T')[0],
      tags: ['Audiencia'],
    },
  ]);

  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();
  const calendarGrid = getDaysInMonth(year, month);

  const getEventsForDate = (day: Date) => {
    const dateStr = day.toISOString().split('T')[0];
    return events.filter((e) => e.due_date === dateStr);
  };

  // Crear evento
  const addEvent = (event: CalendarEvent) => {
    setEvents((prev) => [...prev, event]);
  };

  // Editar evento
  const updateEvent = (updatedEvent: CalendarEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
  };

  // Eliminar evento
  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const currentMonthName = viewDate.toLocaleString('es-ES', { month: 'long' });
  const currentYear = viewDate.getFullYear();

  const goToNextMonth = () => {
    setViewDate(new Date(year, month + 1));
  };

  const goToPreviousMonth = () => {
    setViewDate(new Date(year, month - 1));
  };

  // Hoy
  const goToToday = () => {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth()));
    setSelectedDate(now);
  };

  return {
    today,
    selectedDate,
    setSelectedDate,
    calendarGrid,
    events,
    getEventsForDate,
    addEvent,
    updateEvent,
    deleteEvent,
    currentMonthName: currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1),
    currentYear,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
  };
}