import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { MoreVertical } from 'lucide-react';
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
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        open
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const toggleMenu = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
    setOpen((v) => !v);
  };

  return (
    <>
      <button
        type="button"
        ref={buttonRef}
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Abrir menú de acciones para factura #${invoice.id}`}
        className="cursor-pointer text-gray-500 hover:text-black focus:outline-none"
      >
        <MoreVertical size={16} />
      </button>

      {open &&
        ReactDOM.createPortal(
          <div
            style={{
              position: 'absolute',
              top: position.top,
              left: position.left,
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: '4px',
              zIndex: 1000,
              minWidth: '160px',
            }}
            role="menu"
            aria-label={`Opciones de factura #${invoice.id}`}
          >
            {[
              { label: 'Editar factura', onClick: onEdit },
              { label: 'Eliminar factura', onClick: onDelete },
              { label: 'Enviar por correo', onClick: onSendEmail },
              { label: 'Duplicar factura', onClick: onDuplicate },
              { label: 'Marcar como pagada', onClick: onMarkPaid },
              { label: 'Ver historial', onClick: onViewHistory },
            ].map(({ label, onClick }) => (
              <button
                key={label}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                onClick={() => {
                  onClick(invoice);
                  setOpen(false);
                }}
                role="menuitem"
                type="button"
              >
                {label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};
