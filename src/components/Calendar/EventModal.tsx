import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCalendar } from '~/types/useCalendar';
import { CalendarEvent } from '~/types/useCalendar';

interface Props {
  onClose: () => void;
  defaultDate?: Date;
  editingEvent?: CalendarEvent | null;
  toast: any;
}

export function EventModal({ onClose, defaultDate, editingEvent, toast }: Props) {
  const { addEvent, updateEvent } = useCalendar();

  const [eventName, setEventName] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(
    defaultDate ? new Date(defaultDate.getTime() - defaultDate.getTimezoneOffset() * 60000).toISOString().split('T')[0] : ''
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingEvent) {
      setEventName(editingEvent.event_name);
      setTags(editingEvent.tags?.join(', ') || '');
      setDescription(editingEvent.description || '');
      setDueDate(new Date(editingEvent.due_date).toISOString().split('T')[0]);
    }
  }, [editingEvent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const tzOffsetMin = new Date().getTimezoneOffset();
      const tzOffsetHrs = String(Math.floor(Math.abs(tzOffsetMin) / 60)).padStart(2, '0');
      const tzOffsetMins = String(Math.abs(tzOffsetMin) % 60).padStart(2, '0');
      const tzSign = tzOffsetMin > 0 ? '-' : '+';
      const dueDateISO = `${dueDate}T00:00:00${tzSign}${tzOffsetHrs}:${tzOffsetMins}`;

      const payload = {
        event_name: eventName,
        description,
        due_date: dueDateISO,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      const url = editingEvent
        ? `${import.meta.env.VITE_API_DOMAIN}/agenda/update/${editingEvent.id}`
        : `${import.meta.env.VITE_API_DOMAIN}/agenda/new`;

      const res = await fetch(url, {
        method: editingEvent ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const savedEvent: CalendarEvent = await res.json();
      if (editingEvent) updateEvent(savedEvent);
      else addEvent(savedEvent);

      toast.success(`Evento ${editingEvent ? 'actualizado' : 'creado'} correctamente`);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('No se pudo guardar el evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <button className="absolute top-3 right-3 text-gray-500" onClick={onClose}>
          <X />
        </button>
        <h2 className="text-lg font-bold mb-4">{editingEvent ? 'Editar Evento' : 'Nuevo Evento'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={eventName} onChange={e => setEventName(e.target.value)} placeholder="Título" required className="w-full border rounded px-3 py-2" />
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="w-full border rounded px-3 py-2" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción" className="w-full border rounded px-3 py-2" />
          <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Etiquetas separadas por coma" className="w-full border rounded px-3 py-2" />
          <button type="submit" disabled={loading} className="bg-links text-white w-full py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar Evento'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}