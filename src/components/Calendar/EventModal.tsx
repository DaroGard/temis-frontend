import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { CalendarEvent } from '~/types/useCalendar';

interface Props {
  onClose: () => void;
  defaultDate?: Date;
  editingEvent?: CalendarEvent | null;
}

export function EventModal({ onClose, defaultDate, editingEvent }: Props) {
  const [eventName, setEventName] = useState('');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState(
    defaultDate?.toISOString().split('T')[0] || ''
  );

  useEffect(() => {
    if (editingEvent) {
      setEventName(editingEvent.event_name);
      setTags(editingEvent.tags?.join(', ') || '');
      setDueDate(editingEvent.due_date);
    }
  }, [editingEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent: CalendarEvent = {
      id: editingEvent?.id || crypto.randomUUID(),
      account_id: editingEvent?.account_id || 'acc_001',
      user_id: editingEvent?.user_id || 'usr_123',
      event_name: eventName,
      due_date: dueDate,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    console.log('Evento guardado:', newEvent);

    onClose();
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
        <h2 className="text-lg font-bold mb-4">
          {editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Título</label>
            <input
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Fecha</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Etiquetas</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Importante, Reunión, Legal..."
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            Guardar Evento
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}