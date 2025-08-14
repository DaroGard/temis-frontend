import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Edit, Trash } from 'lucide-react';
import { EventModal } from './EventModal';
import { useCalendar } from '~/types/useCalendar';

interface Props {
    date: Date;
    onClose: () => void;
}

export function EventListModal({ date, onClose }: Props) {
    const { getEventsForDate, deleteEvent } = useCalendar();
    const events = getEventsForDate(date);

    const [editingEvent, setEditingEvent] = useState<any | null>(null);

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
                    Eventos del {date.toLocaleDateString()}
                </h2>

                {events.length === 0 ? (
                    <p className="text-sm text-gray-500">No hay eventos para este día.</p>
                ) : (
                    <ul className="space-y-2">
                        {events.map((event) => (
                            <li key={event.id} className="flex justify-between items-center border p-2 rounded">
                                <div>
                                    <p className="font-semibold">{event.event_name}</p>
                                    {event.tags && <p className="text-xs text-gray-500">{event.tags}</p>}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingEvent(event)}
                                        className="text-links hover:text-blue-700"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm("¿Seguro que deseas eliminar este evento?")) {
                                                deleteEvent(event.id);
                                            }
                                        }}
                                        className="text-warning hover:text-red-700"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {editingEvent && (
                    <EventModal
                        onClose={() => setEditingEvent(null)}
                        defaultDate={date}
                        editingEvent={editingEvent}
                    />
                )}
            </motion.div>
        </motion.div>
    );
}