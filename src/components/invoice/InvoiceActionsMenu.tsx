import React, { useState, useEffect, useRef, useCallback, useMemo, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Dialog, Transition } from '@headlessui/react';
import {
  MoreVertical,
  Pencil,
  Trash,
  Send,
  CheckCircle,
} from 'lucide-react';
import type { Invoice, InvoiceItem } from '~/types/invoice';

const API_BASE_URL = 'http://localhost:8000';

interface Props {
  invoice: Invoice;
  onEdit: (inv: Invoice) => void;
  onDelete: (inv: Invoice) => void;
  onSendEmail: (inv: Invoice) => void;
  onMarkPaid: (inv: Invoice) => void;
}

const actions = [
  { label: 'Editar factura', icon: Pencil, key: 'edit' },
  { label: 'Eliminar factura', icon: Trash, key: 'delete' },
  { label: 'Enviar por correo', icon: Send, key: 'sendEmail' },
  { label: 'Marcar como pagada', icon: CheckCircle, key: 'markPaid' },
] as const;

export const InvoiceActionsMenu: React.FC<Props> = ({
  invoice,
  onEdit,
  onDelete,
  onSendEmail,
  onMarkPaid,
}) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>(invoice.items);
  const originalIssueDate = invoice.issueDate;
  const [newIssueDate, setNewIssueDate] = useState<string>('');

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + item.hours * item.rate, 0);
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'name' ? value : Number(value),
    };
    setItems(newItems);
  };

  const handleSave = () => {
    const today = new Date().toISOString().split('T')[0];
    setNewIssueDate(today);

    const updatedInvoice: Invoice = {
      ...invoice,
      items,
      issueDate: today,
      amount: calculateTotal(),
    };
    onEdit(updatedInvoice);
    setModalOpen(false);
  };

  const markPaidHandler = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/invoice/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: invoice.id, status: 'PAYED' }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Error al marcar como pagada');
      }

      // Actualiza localmente el estado a 'Pagada'
      const updatedInvoice: Invoice = {
        ...invoice,
        status: 'Pagada',
      };

      onMarkPaid(updatedInvoice);
    } catch (err) {
      console.error('Error marcando como pagada:', err);
    } finally {
      setOpen(false);
    }
  };

  // Detectar si ya está pagada para deshabilitar opción
  const isPaid =
    invoice.status.toLowerCase() === 'payed' ||
    invoice.status.toLowerCase() === 'pagada';

  const handlers = useMemo(
    () => ({
      edit: () => {
        setItems(invoice.items);
        setNewIssueDate('');
        setModalOpen(true);
        setOpen(false);
      },
      delete: (inv: Invoice) => {
        onDelete(inv);
        setOpen(false);
      },
      sendEmail: (inv: Invoice) => {
        onSendEmail(inv);
        setOpen(false);
      },
      markPaid: () => markPaidHandler(),
    }),
    [invoice.items, onDelete, onSendEmail]
  );

  const toggleMenu = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 160;

      let top = rect.bottom + window.scrollY + 6;
      if (top + menuHeight > window.scrollY + window.innerHeight) {
        top = rect.top + window.scrollY - menuHeight - 6;
      }

      setPosition({
        top,
        left: Math.min(rect.left + window.scrollX, window.innerWidth - 220),
      });
    }
    setOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <>
      {/* Botón menú acciones */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Abrir menú de acciones para factura #${invoice.id}`}
        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-links"
      >
        <MoreVertical size={18} />
      </button>

      {/* Menú flotante */}
      {open &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            style={{ top: position.top, left: position.left, position: 'absolute' }}
            className="bg-white border shadow-lg rounded-xl z-[1000] min-w-[200px] animate-fade-in-up transition-transform duration-150 ease-out"
            role="menu"
            aria-label={`Opciones de factura #${invoice.id}`}
          >
            {actions.map(({ label, icon: Icon, key }) => {
              const disabled = key === 'markPaid' && isPaid;

              return (
                <button
                  key={key}
                  onClick={() => !disabled && handlers[key](invoice)}
                  className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left transition-colors focus:outline-none ${
                    disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-200'
                  }`}
                  role="menuitem"
                  disabled={disabled}
                  aria-disabled={disabled}
                  aria-label={disabled ? `${label} (deshabilitado)` : label}
                >
                  <Icon size={16} className={disabled ? 'text-gray-400' : 'text-gray-500'} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>,
          document.body
        )}

      {/* Modal */}
      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto pointer-events-none"
          onClose={() => setModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center text-black">
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            {/* Panel modal */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl pointer-events-auto">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold leading-7 mb-6"
                >
                  Editar Factura #{invoice.id}
                </Dialog.Title>

                {/* Fechas */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium mb-1 leading-tight">
                      Fecha de emisión original
                    </label>
                    <input
                      type="text"
                      value={originalIssueDate}
                      readOnly
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100 cursor-not-allowed text-gray-600 leading-tight box-border"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="block text-sm font-medium mb-1 leading-tight">
                      Nueva fecha de emisión
                    </label>
                    <input
                      type="text"
                      value={newIssueDate || 'Se actualizará al guardar'}
                      readOnly
                      className={`w-full border rounded-md px-3 py-2 text-sm leading-tight box-border ${
                        newIssueDate
                          ? 'border-success text-success bg-green-50'
                          : 'border-gray-300 text-gray-500 bg-gray-100'
                      } cursor-not-allowed`}
                    />
                  </div>
                </div>

                {/* Items editables */}
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center"
                    >
                      <div>
                        <label
                          htmlFor={`desc-${index}`}
                          className="block text-sm font-medium mb-1"
                        >
                          Descripción
                        </label>
                        <input
                          id={`desc-${index}`}
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
                        <label
                          htmlFor={`hours-${index}`}
                          className="block text-sm font-medium mb-1"
                        >
                          Horas
                        </label>
                        <input
                          id={`hours-${index}`}
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
                        <label
                          htmlFor={`rate-${index}`}
                          className="block text-sm font-medium mb-1"
                        >
                          Tarifa
                        </label>
                        <input
                          id={`rate-${index}`}
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
                    </div>
                  ))}
                </div>

                {/* Total y acciones */}
                <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
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
                      onClick={() => setModalOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="px-6 py-2 bg-links text-white rounded-md text-sm font-semibold hover:bg-links transition"
                      onClick={handleSave}
                    >
                      Guardar cambios
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};