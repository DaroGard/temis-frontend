import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import {
  MoreVertical,
  Pencil,
  Trash,
  Send,
  Copy,
  CheckCircle,
  History,
} from 'lucide-react';
import type { Invoice } from '~/types/invoice';

interface Props {
  invoice: Invoice;
  onEdit: (inv: Invoice) => void;
  onDelete: (inv: Invoice) => void;
  onSendEmail: (inv: Invoice) => void;
  onDuplicate: (inv: Invoice) => void;
  onMarkPaid: (inv: Invoice) => void;
  onViewHistory: (inv: Invoice) => void;
}

const actions = [
  { label: 'Editar factura', icon: Pencil, key: 'edit' },
  { label: 'Eliminar factura', icon: Trash, key: 'delete' },
  { label: 'Enviar por correo', icon: Send, key: 'sendEmail' },
  { label: 'Duplicar factura', icon: Copy, key: 'duplicate' },
  { label: 'Marcar como pagada', icon: CheckCircle, key: 'markPaid' },
  { label: 'Ver historial', icon: History, key: 'viewHistory' },
] as const;

export const InvoiceActionsMenu: React.FC<Props> = ({
  invoice,
  onEdit,
  onDelete,
  onSendEmail,
  onDuplicate,
  onMarkPaid,
  onViewHistory,
}) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handlers = useMemo(
    () => ({
      edit: onEdit,
      delete: onDelete,
      sendEmail: onSendEmail,
      duplicate: onDuplicate,
      markPaid: onMarkPaid,
      viewHistory: onViewHistory,
    }),
    [onEdit, onDelete, onSendEmail, onDuplicate, onMarkPaid, onViewHistory]
  );

  const toggleMenu = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 6,
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
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Abrir menú de acciones para factura #${invoice.id}`}
        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <MoreVertical size={18} />
      </button>

      {open &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            style={{ top: position.top, left: position.left, position: 'absolute' }}
            className="bg-white border shadow-lg rounded-xl z-[1000] min-w-[200px] animate-fade-in-up transition-transform duration-150 ease-out"
            role="menu"
            aria-label={`Opciones de factura #${invoice.id}`}
          >
            {actions.map(({ label, icon: Icon, key }) => (
              <button
                key={key}
                onClick={() => {
                  handlers[key](invoice);
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:bg-gray-200"
                role="menuitem"
              >
                <Icon size={16} className="text-gray-500" />
                <span>{label}</span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};