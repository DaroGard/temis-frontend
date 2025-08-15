import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCalendarContext } from "~/components/Calendar/CalendarContext";
import { CalendarEvent } from "~/types/useCalendar";

interface Props {
  onClose: () => void;
  defaultDate?: Date;
  editingEvent?: CalendarEvent | null;
  toast: any;
}

export function EventModal({ onClose, defaultDate, editingEvent, toast }: Props) {
  // contexto del calendario
  const { addEvent, updateEvent } = useCalendarContext();

  // estados del formulario
  const [eventName, setEventName] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(
    defaultDate
      ? new Date(defaultDate.getTime() - defaultDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0]
      : ""
  );
  const [loading, setLoading] = useState(false);

  // cargar datos si se edita un evento
  useEffect(() => {
    if (editingEvent) {
      setEventName(editingEvent.event_name);
      setTags(editingEvent.tags?.join(", ") || "");
      setDescription(editingEvent.description || "");
      setDueDate(new Date(editingEvent.due_date).toISOString().split("T")[0]);
    }
  }, [editingEvent]);

  // enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // calcular zona horaria
      const tzOffsetMin = new Date().getTimezoneOffset();
      const tzSign = tzOffsetMin > 0 ? "-" : "+";
      const tzHours = String(Math.floor(Math.abs(tzOffsetMin) / 60)).padStart(2, "0");
      const tzMinutes = String(Math.abs(tzOffsetMin) % 60).padStart(2, "0");
      const dueDateISO = `${dueDate}T00:00:00${tzSign}${tzHours}:${tzMinutes}`;

      const payload = {
        event_name: eventName,
        description,
        due_date: dueDateISO,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      // URL según acción 
      const url = editingEvent
        ? `${import.meta.env.VITE_API_DOMAIN}/agenda/update/${editingEvent.id}`
        : `${import.meta.env.VITE_API_DOMAIN}/agenda/new`;

      const res = await fetch(url, {
        method: editingEvent ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      const savedEvent: CalendarEvent = await res.json();

      // actualizar contexto
      editingEvent ? updateEvent(savedEvent) : addEvent(savedEvent);
      toast.success(`Evento ${editingEvent ? "actualizado" : "creado"} correctamente`);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo guardar el evento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {/* overlay del modal */}
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* contenido del modal */}
        <motion.div
          className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* botón cerrar */}
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors"
            onClick={onClose}
          >
            <X />
          </button>

          {/* título */}
          <h2 className="text-xl font-semibold mb-4">{editingEvent ? "Editar Evento" : "Nuevo Evento"}</h2>

          {/* formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Título"
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-links"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-links"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-links"
            />
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Etiquetas separadas por coma"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-links"
            />
            {/* botón guardar */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="bg-links text-white w-full py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Evento"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}