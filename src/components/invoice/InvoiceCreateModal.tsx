import React, { useState, Fragment, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import type { InvoiceItem } from '~/types/invoice';
import type { Client } from '~/types/client';

export type InvoiceFormData = Omit<{
    client_id: number;
    caseNumber: string;
    issueDate: string;
    dueDate: string;
    status: 'Pendiente' | 'Pagada' | 'Vencida';
    amount: number;
    items: InvoiceItem[];
}, 'id'>;

interface Props {
    open: boolean;
    onClose: () => void;
    onCreate: (invoice: InvoiceFormData) => void;
    clients: Client[] | null | undefined;
}

const emptyItem = (): InvoiceItem => ({
    description: '', hours_worked: 0, hourly_rate: 0,
    id: 0
});

export const InvoiceCreateModal: React.FC<Props> = ({
    open,
    onClose,
    onCreate,
    clients,
}) => {
    // Estados
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [caseNumber, setCaseNumber] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [items, setItems] = useState<InvoiceItem[]>([emptyItem()]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const modalRef = useRef<HTMLDivElement>(null);

    const safeClients = Array.isArray(clients) ? clients : [];

    useEffect(() => {
        if (open && modalRef.current) {
            modalRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [open]);

    // Cálculo 
    const calculateTotal = () =>
        items.reduce((acc, item) => acc + item.hours_worked * item.hourly_rate, 0);

    // Validación del formulario
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!selectedClientId) newErrors.client = 'Cliente obligatorio';
        if (!caseNumber.trim()) newErrors.caseNumber = 'Número de caso obligatorio';
        if (!dueDate.trim()) newErrors.dueDate = 'Fecha de vencimiento obligatoria';
        if (items.filter(i => i.description && i.hours_worked > 0 && i.hourly_rate > 0).length === 0)
            newErrors.items = 'Debe agregar al menos un ítem válido';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejo de cambios en ítems
    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string) => {
        setItems(old => {
            const newItems = [...old];
            newItems[index] = {
                ...newItems[index],
                [field]: field === 'description' ? value : Number(value),
            };
            return newItems;
        });
    };

    const addItem = () => setItems(old => [...old, emptyItem()]);
    const removeItem = (index: number) =>
        setItems(old => old.filter((_, i) => i !== index));

    // Guardar factura
    const handleSave = () => {
        if (!validate()) return;

        const validItems = items.filter(
            item => item.description && item.hours_worked > 0 && item.hourly_rate > 0
        );
        const today = new Date().toISOString().split('T')[0];

        onCreate({
            client_id: selectedClientId!,
            caseNumber,
            issueDate: today,
            dueDate,
            status: 'Pendiente',
            amount: calculateTotal(),
            items: validItems,
        });

        // Reset del formulario
        setSelectedClientId(null);
        setCaseNumber('');
        setDueDate('');
        setItems([emptyItem()]);
        setErrors({});
        onClose();
    };

    const isSaveDisabled =
        !selectedClientId ||
        !caseNumber.trim() ||
        !dueDate.trim() ||
        items.filter(i => i.description && i.hours_worked > 0 && i.hourly_rate > 0).length === 0;

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-50 overflow-y-auto pointer-events-none"
                onClose={onClose}
            >
                <div className="min-h-screen px-4 text-center text-black">
                    <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel
                            ref={modalRef}
                            className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl pointer-events-auto"
                        >
                            {/* Título */}
                            <Dialog.Title as="h3" className="text-2xl font-semibold leading-7 mb-6">
                                Crear nueva factura
                            </Dialog.Title>

                            {/*  Sección Cliente */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Cliente</label>
                                <select
                                    value={selectedClientId ?? ''}
                                    onChange={(e) => setSelectedClientId(Number(e.target.value) || null)}
                                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-links focus:border-links ${errors.client ? 'border-warning' : 'border-gray-300'}`}
                                >
                                    <option value="">Selecciona un cliente</option>
                                    {safeClients.map(client => (
                                        <option key={client.id} value={client.id}>
                                            {client.first_name} {client.last_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.client && <p className="text-warning text-xs mt-1">{errors.client}</p>}
                            </div>

                            {/* Sección Número de Caso */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Número de caso</label>
                                <input
                                    type="text"
                                    value={caseNumber}
                                    onChange={(e) => setCaseNumber(e.target.value)}
                                    placeholder="Número de caso"
                                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-links focus:border-links ${errors.caseNumber ? 'border-warning' : 'border-gray-300'}`}
                                />
                                {errors.caseNumber && <p className="text-warning text-xs mt-1">{errors.caseNumber}</p>}
                            </div>

                            {/*  Sección Fecha de Vencimiento */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-1">Fecha de vencimiento</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-links focus:border-links ${errors.dueDate ? 'border-warning' : 'border-gray-300'}`}
                                />
                                {errors.dueDate && <p className="text-warning text-xs mt-1">{errors.dueDate}</p>}
                            </div>

                            {/* Sección Items con animación */}
                            <div className="space-y-4 mb-6">
                                <AnimatePresence>
                                    {items.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            layout
                                            className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center"
                                        >
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Descripción</label>
                                                <input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                    placeholder="Descripción"
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-links focus:border-links"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Horas</label>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={item.hours_worked}
                                                    onChange={(e) => handleItemChange(index, 'hours_worked', e.target.value)}
                                                    placeholder="Horas"
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-links focus:border-links"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Tarifa</label>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={item.hourly_rate}
                                                    onChange={(e) => handleItemChange(index, 'hourly_rate', e.target.value)}
                                                    placeholder="Tarifa"
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-links focus:border-links"
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                {items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        className="ml-2 text-warning hover:text-warning transition"
                                                        aria-label={`Eliminar ítem ${index + 1}`}
                                                    >
                                                        &times;
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {errors.items && <p className="text-warning text-xs">{errors.items}</p>}
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="text-links hover:text-links font-semibold"
                                >
                                    + Añadir ítem
                                </button>
                            </div>

                            {/*  Total */}
                            <motion.p
                                className="font-semibold text-xl mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                key={calculateTotal()}
                            >
                                Total:{' '}
                                <span className={`font-extrabold ${calculateTotal() === 0 ? 'text-warning' : 'text-links'}`}>
                                    ${calculateTotal().toFixed(2)}
                                </span>
                            </motion.p>

                            {/*  Acciones  */}
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                                <button
                                    type="button"
                                    className="px-6 py-2 border border-gray-300 rounded-md text-sm font-semibold hover:bg-gray-100 transition"
                                    onClick={onClose}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className={`px-6 py-2 rounded-md text-sm font-semibold transition ${isSaveDisabled
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-links text-white hover:bg-links'
                                        }`}
                                    onClick={handleSave}
                                    disabled={isSaveDisabled}
                                >
                                    Crear factura
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};