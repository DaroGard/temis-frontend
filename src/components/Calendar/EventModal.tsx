import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
  defaultDate?: Date;
}

export function EventModal({ onClose, defaultDate }: Props) {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(defaultDate?.toISOString().split('T')[0] || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí podrías guardar a base de datos (Firebase, SQL, etc)
    console.log({ title, tags, description, date });
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
        <h2 className="text-lg font-bold mb-4">Nuevo Evento</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
          <div>
            <label className="block text-sm font-medium">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
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
