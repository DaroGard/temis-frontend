import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = `${import.meta.env.VITE_API_DOMAIN}/agenda`;

export interface CalendarEvent {
  id: string;
  account_id?: string;
  user_id?: string;
  event_name: string;
  due_date: string;
  tags: string[];
  description?: string;
}

function getDaysInMonth(year: number, month: number) {
  const date = new Date(year, month, 1);
  const days: { date: Date; currentMonth: boolean }[] = [];

  const startDay = date.getDay();
  const prevMonthDays = startDay === 0 ? 6 : startDay - 1;

  for (let i = prevMonthDays; i > 0; i--) {
    days.push({ date: new Date(year, month, 1 - i), currentMonth: false });
  }

  while (date.getMonth() === month) {
    days.push({ date: new Date(date), currentMonth: true });
    date.setDate(date.getDate() + 1);
  }

  const nextDays = 42 - days.length;
  for (let i = 0; i < nextDays; i++) {
    days.push({ date: new Date(year, month + 1, i + 1), currentMonth: false });
  }

  return days;
}

function toLocalISOString(date: Date) {
  const tzOffsetMin = -date.getTimezoneOffset();
  const sign = tzOffsetMin >= 0 ? '+' : '-';
  const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, '0');
  const offsetHours = pad(tzOffsetMin / 60);
  const offsetMinutes = pad(tzOffsetMin % 60);

  return (
    date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds()) +
    sign + offsetHours + ':' + offsetMinutes
  );
}

export function useCalendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const isFetchingRef = useRef(false);

  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();
  const calendarGrid = getDaysInMonth(year, month);

  const fetchEvents = useCallback(async () => {
    if (isFetchingRef.current) return; 
    isFetchingRef.current = true;

    try {
      setLoading(true);
      const dateFrom = toLocalISOString(new Date(year, month, 1));
      const dateTo = toLocalISOString(new Date(year, month + 1, 0, 23, 59, 59));
      const params = new URLSearchParams({ date_from: dateFrom, date_to: dateTo });
      const res = await fetch(`${API_BASE}/items/all?${params.toString()}`, { credentials: 'include' });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: CalendarEvent[] = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [month, year]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  useEffect(() => {
    const interval = setInterval(() => fetchEvents(), 60000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  const getEventsForDate = useCallback(
    (day: Date) => {
      const dateStr = day.toISOString().split('T')[0];
      return events.filter(e => e.due_date.startsWith(dateStr));
    },
    [events]
  );

  const addEvent = (event: CalendarEvent) => {
    setEvents(prev => [...prev, event]);
  };

  const updateEvent = (event: CalendarEvent) => {
    setEvents(prev => prev.map(e => e.id === event.id ? event : e));
  };

  const deleteEvent = async (eventId: string) => {
    const res = await fetch(`${API_BASE}/delete/${eventId}`, { method: 'DELETE', credentials: 'include' });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const currentMonthName = viewDate.toLocaleString('es-ES', { month: 'long' });
  const currentYear = viewDate.getFullYear();

  return {
    today,
    selectedDate,
    setSelectedDate,
    calendarGrid,
    events,
    loading,
    getEventsForDate,
    addEvent,
    updateEvent,
    deleteEvent,
    currentMonthName: currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1),
    currentYear,
    goToNextMonth: () => setViewDate(new Date(year, month + 1)),
    goToPreviousMonth: () => setViewDate(new Date(year, month - 1)),
    goToToday: () => { const now = new Date(); setViewDate(new Date(now.getFullYear(), now.getMonth())); setSelectedDate(now); }
  };
}