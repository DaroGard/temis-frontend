import { useState } from 'react';

export interface CalendarEvent {
  id: string;
  accountId: string;
  userId: string;
  title: string;
  date: string; // YYYY-MM-DD
  tags: string[];
  description: string;
}

function getDaysInMonth(year: number, month: number) {
  const date = new Date(year, month, 1);
  const days = [];

  // Primer día del mes (0 = domingo)
  const startDay = date.getDay();
  const prevMonthDays = startDay === 0 ? 6 : startDay - 1;

  // Días del mes anterior para llenar la cuadrícula
  for (let i = prevMonthDays; i > 0; i--) {
    const d = new Date(year, month, 1 - i);
    days.push({ date: d, currentMonth: false });
  }

  // Días del mes actual
  while (date.getMonth() === month) {
    days.push({ date: new Date(date), currentMonth: true });
    date.setDate(date.getDate() + 1);
  }

  // Días del mes siguiente para completar cuadrícula
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

  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();
  const calendarGrid = getDaysInMonth(year, month);

  const events: CalendarEvent[] = [
    {
      id: '1',
      accountId: 'acc_001',
      userId: 'usr_123',
      title: 'Audiencia Civil',
      date: today.toISOString().split('T')[0],
      tags: ['Audiencia'],
      description: 'Caso González vs Rivera',
    },
  ];

  const getEventsForDate = (day: Date) => {
    const dateStr = day.toISOString().split('T')[0];
    return events.filter((e) => e.date === dateStr);
  };

  const currentMonthName = viewDate.toLocaleString('es-ES', { month: 'long' });
  const currentYear = viewDate.getFullYear();

  const goToNextMonth = () => {
    setViewDate(new Date(year, month + 1));
  };

  const goToPreviousMonth = () => {
    setViewDate(new Date(year, month - 1));
  };

  return {
    today,
    selectedDate,
    setSelectedDate,
    calendarGrid,
    events,
    getEventsForDate,
    currentMonthName: currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1),
    currentYear,
    goToNextMonth,
    goToPreviousMonth,
  };
}
