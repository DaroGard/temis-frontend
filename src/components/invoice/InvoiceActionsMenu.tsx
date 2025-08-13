import React, { useState, useRef, useCallback, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Dialog, Transition } from '@headlessui/react';
import { MoreVertical, Pencil, Trash, Send, CheckCircle, Plus, X } from 'lucide-react';
import type { InvoiceSummary, InvoiceItem } from '~/types/invoice';
import toast from 'react-hot-toast';

interface Props {
  invoice: InvoiceSummary;
  onEdit: (inv: InvoiceSummary) => void;
  onDelete: (inv: InvoiceSummary) => void;
  onSendEmail: (inv: InvoiceSummary) => void;
  onMarkPaid: (inv: InvoiceSummary) => void;
}

const API_BASE_URL = 'http://localhost:8000';

export const InvoiceActionsMenu: React.FC<Props> = ({
  invoice,
  onEdit,
  onDelete,
  onSendEmail,
  onMarkPaid,
}) => {
  // Estados principales 
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'edit' | 'delete' | 'send' | 'mark' | null>(null);

  const [items, setItems] = useState<InvoiceItem[]>(invoice.items ?? []);
  const [newIssueDate, setNewIssueDate] = useState('');

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuHeight = 160;

  const isPaid = invoice.status.toLowerCase() === 'pagada';

  // Cálculo total 
  const calculateTotal = () => items.reduce((acc, item) => acc + item.hours_worked * item.hourly_rate, 0);

  // Actualización de items
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string) => {
    setItems(prev => {
      const copy = [...prev];
      if (field === 'description') copy[index][field] = value;
      else copy[index][field] = Math.max(Number(value), 0);
      return copy;
    });
  };

  const addItem = () => setItems(prev => [...prev, { description: '', hours_worked: 0, hourly_rate: 0 }]);
  const removeItem = (index: number) => setItems(prev => prev.filter((_, i) => i !== index));

  // Acciones del menú
  const actions = [
    {
      key: 'edit', label: 'Editar factura', icon: Pencil,
      handler: () => { setItems(invoice.items ?? []); setNewIssueDate(''); setModalOpen(true); setMenuOpen(false); },
      disabled: false
    },
    {
      key: 'delete', label: 'Eliminar factura', icon: Trash,
      handler: () => { setConfirmDeleteOpen(true); setMenuOpen(false); },
      disabled: false
    },
    {
      key: 'sendEmail', label: 'Enviar por correo', icon: Send,
      handler: async () => {
        if (!invoice.client_email) return toast.error('Cliente sin correo registrado');
        setLoadingAction('send');
        try {
          const res = await fetch(`${API_BASE_URL}/notifications/invoice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ to_email: invoice.client_email, client_name: invoice.client_name, invoice_id: invoice.id }),
          });
          if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.detail || 'Error al enviar correo');
          toast.success('Correo enviado correctamente');
          onSendEmail(invoice);
        } catch (err: any) { toast.error(err?.message || 'Error al enviar correo'); }
        finally { setLoadingAction(null); }
      },
      disabled: false
    },
    {
      key: 'markPaid', label: 'Marcar como pagada', icon: CheckCircle,
      handler: async () => {
        setLoadingAction('mark');
        try {
          const res = await fetch(`${API_BASE_URL}/invoice/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id: invoice.id, status: 'PAYED' })
          });
          if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.detail || 'Error al marcar como pagada');
          toast.success('Factura marcada como pagada');
          onMarkPaid({ ...invoice, status: 'Pagada' });
        } catch (err: any) { toast.error(err?.message || 'Error al marcar como pagada'); }
        finally { setLoadingAction(null); }
      },
      disabled: isPaid
    },
  ];

  // Menú
  const toggleMenu = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      let top = rect.bottom + window.scrollY + 6;
      if (top + menuHeight > window.scrollY + window.innerHeight) top = rect.top + window.scrollY - menuHeight - 6;
      setMenuPosition({ top, left: Math.min(rect.left + window.scrollX, window.innerWidth - 220) });
    }
    setMenuOpen(prev => !prev);
  }, []);

  // Cierre menú 
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  // Confirmacion de eliminacion
  const confirmDeleteInvoice = async () => {
    setLoadingAction('delete');
    try {
      const res = await fetch(`${API_BASE_URL}/invoice/delete?invoice_id=${invoice.id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.detail || 'Error al eliminar');
      toast.success('Factura eliminada correctamente');
      onDelete(invoice);
      setConfirmDeleteOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'Error al eliminar');
    } finally { setLoadingAction(null); }
  };

  return (
    <>
      {/* botón menú */}
      <button ref={buttonRef} onClick={toggleMenu} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-links">
        <MoreVertical size={18} />
      </button>

      {/* menú de acciones */}
      {menuOpen && ReactDOM.createPortal(
        <div ref={menuRef} style={{ top: menuPosition.top, left: menuPosition.left, position: 'absolute' }}
          className="bg-white border shadow-lg rounded-xl z-[1000] min-w-[200px] animate-fade-in-up transition-transform duration-150 ease-out" role="menu">
          {actions.map(({ key, label, icon: Icon, handler, disabled }) => (
            <button
              key={key}
              onClick={() => !disabled && handler()}
              disabled={disabled || loadingAction !== null}
              className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
              aria-disabled={disabled || loadingAction !== null}
              role="menuitem"
            >
              <Icon size={16} className={disabled ? 'text-gray-400' : 'text-gray-500'} />
              {label} {loadingAction === key && '...'}
            </button>
          ))}
        </div>,
        document.body
      )}

      {/* modal editar */}
      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto pointer-events-none" onClose={() => setModalOpen(false)}>
          <div className="min-h-screen px-4 text-center text-black">
            <span className="inline-block h-screen align-middle">&#8203;</span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl pointer-events-auto">

                {/* título */}
                <Dialog.Title className="text-2xl font-semibold mb-6">Editar Factura #{invoice.id}</Dialog.Title>

                {/* fechas */}
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha de emisión original</label>
                    <input type="text" value={invoice.emission_date} readOnly className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100 cursor-not-allowed text-gray-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nueva fecha de emisión</label>
                    <input type="text" value={newIssueDate || 'Se actualizará al guardar'} readOnly className={`w-full border rounded-md px-3 py-2 text-sm ${newIssueDate ? 'border-success text-success bg-green-50' : 'border-gray-300 text-gray-500 bg-gray-100'} cursor-not-allowed`} />
                  </div>
                </div>

                {/* items */}
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center relative">
                      {(['description', 'hours_worked', 'hourly_rate'] as const).map((field, i) => (
                        <div key={i}>
                          <label className="block text-sm font-medium mb-1">{field === 'description' ? 'Descripción' : field === 'hours_worked' ? 'Horas' : 'Tarifa'}</label>
                          <input
                            type={field === 'description' ? 'text' : 'number'}
                            min={0}
                            value={item[field]}
                            onChange={(e) => handleItemChange(index, field, e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-links focus:border-links"
                          />
                        </div>
                      ))}
                      <button onClick={() => removeItem(index)} className="absolute top-1 right-0 p-1 text-warning hover:text-red-700">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button onClick={addItem} className="flex items-center gap-1 text-links text-sm font-semibold hover:underline">
                    <Plus size={16} /> Agregar item
                  </button>
                </div>

                {/* total y acciones */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                  <p className="font-semibold text-xl">Total: <span className="font-extrabold text-links">${calculateTotal().toFixed(2)}</span></p>
                  <div className="flex space-x-4">
                    <button onClick={() => setModalOpen(false)} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-semibold hover:bg-gray-100 transition">Cancelar</button>
                    <button onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      setNewIssueDate(today);
                      onEdit({ ...invoice, emission_date: today, items, total_amount: calculateTotal() });
                      setModalOpen(false);
                    }} className="px-6 py-2 bg-links text-white rounded-md text-sm font-semibold hover:bg-links transition">
                      Guardar cambios
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* modal confirmar eliminado */}
      <Transition appear show={confirmDeleteOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={() => setConfirmDeleteOpen(false)}>
          <div className="min-h-screen px-4 text-center">
            <span className="inline-block h-screen align-middle">&#8203;</span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title className="text-lg font-semibold mb-4 text-black">Confirmar eliminación</Dialog.Title>
                <p className="mb-6 text-sm text-gray-600">¿Seguro que deseas eliminar la factura #{invoice.invoice_number}?</p>
                <div className="flex justify-end gap-4">
                  <button onClick={() => setConfirmDeleteOpen(false)} className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100 text-black">Cancelar</button>
                  <button onClick={confirmDeleteInvoice} className="px-4 py-2 text-sm bg-warning text-white rounded-md hover:bg-red-600">{loadingAction === 'delete' ? 'Eliminando...' : 'Eliminar'}</button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};