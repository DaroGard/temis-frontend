import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
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
    clients: Client[];
}

const emptyItem = (): InvoiceItem => ({
    name: '',
    hours: 0,
    rate: 0,
});

export const InvoiceCreateModal: React.FC<Props> = ({
    open,
    onClose,
    onCreate,
    clients,
}) => {
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [caseNumber, setCaseNumber] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [items, setItems] = useState<InvoiceItem[]>([emptyItem()]);

    const calculateTotal = () =>
        items.reduce((acc, item) => acc + item.hours * item.rate, 0);

    const handleItemChange = (
        index: number,
        field: keyof InvoiceItem,
        value: string
    ) => {
        setItems((old) => {
            const newItems = [...old];
            newItems[index] = {
                ...newItems[index],
                [field]: field === 'name' ? value : Number(value),
            };
            return newItems;
        });
    };

    const addItem = () => setItems((old) => [...old, emptyItem()]);
    const removeItem = (index: number) =>
        setItems((old) => old.filter((_, i) => i !== index));

    const handleSave = () => {
        if (!selectedClientId) {
            alert('Debes seleccionar un cliente');
            return;
        }
        if (!caseNumber.trim()) {
            alert('El número de caso es obligatorio');
            return;
        }
        if (!dueDate.trim()) {
            alert('La fecha de vencimiento es obligatoria');
            return;
        }
        const validItems = items.filter(
            (item) => item.name.trim() !== '' && item.hours > 0 && item.rate > 0
        );
        if (validItems.length === 0) {
            alert('Debes añadir al menos un ítem con valores válidos');
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        onCreate({
            client_id: selectedClientId,
            caseNumber,
            issueDate: today,
            dueDate,
            status: 'Pendiente',
            amount: calculateTotal(),
            items: validItems,
        });

        // Reset form y cerrar modal
        setSelectedClientId(null);
        setCaseNumber('');
        setDueDate('');
        setItems([emptyItem()]);
        onClose();
    };

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-50 overflow-y-auto pointer-events-none"
                onClose={onClose}
            >
                <div className="min-h-screen px-4 text-center text-black">
                    <span
                        className="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl pointer-events-auto">
                            <Dialog.Title
                                as="h3"
                                className="text-2xl font-semibold leading-7 mb-6"
                            >
                                Crear nueva factura
                            </Dialog.Title>

                            {/* Selector de Cliente */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-1">
                                    Cliente
                                </label>
                                <select
                                    value={selectedClientId ?? ''}
                                    onChange={(e) =>
                                        setSelectedClientId(Number(e.target.value) || null)
                                    }
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-links focus:border-links"
                                >
                                    <option value="">Selecciona un cliente</option>
                                    {clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.first_name} {client.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Número de Caso */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-1">
                                    Número de caso
                                </label>
                                <input
                                    type="text"
                                    value={caseNumber}
                                    onChange={(e) => setCaseNumber(e.target.value)}
                                    placeholder="Número de caso"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-links focus:border-links"
                                />
                            </div>

                            {/* Fecha de vencimiento */}
                            <div className="mb-8">
                                <label className="block text-sm font-medium mb-1">
                                    Fecha de vencimiento
                                </label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-links focus:border-links"
                                />
                            </div>

                            {/* Items */}
                            <div className="space-y-6 mb-6">
                                {items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Descripción
                                            </label>
                                            <input
                                                type="text"
                                                value={item.name}
                                                onChange={(e) =>
                                                    handleItemChange(index, 'name', e.target.value)
                                                }
                                                placeholder="Descripción"
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-links focus:border-links"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Horas
                                            </label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={item.hours}
                                                onChange={(e) =>
                                                    handleItemChange(index, 'hours', e.target.value)
                                                }
                                                placeholder="Horas"
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-links focus:border-links"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Tarifa
                                            </label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={item.rate}
                                                onChange={(e) =>
                                                    handleItemChange(index, 'rate', e.target.value)
                                                }
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
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="text-links hover:text-links font-semibold"
                                >
                                    + Añadir ítem
                                </button>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                                <p className="font-semibold text-xl">
                                    Total:{' '}
                                    <span className="font-extrabold text-links">
                                        ${calculateTotal().toFixed(2)}
                                    </span>
                                </p>

                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        className="px-6 py-2 border border-gray-300 rounded-md text-sm font-semibold hover:bg-gray-100 transition"
                                        onClick={onClose}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="px-6 py-2 bg-links text-white rounded-md text-sm font-semibold hover:bg-links transition"
                                        onClick={handleSave}
                                    >
                                        Crear factura
                                    </button>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};