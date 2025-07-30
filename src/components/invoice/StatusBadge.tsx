import React from 'react';
import type { InvoiceStatus } from '~/types/invoice';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface Props {
  status: InvoiceStatus;
}

const statusConfig: Record<
  InvoiceStatus,
  {
    textColor: string;
    bgColor: string;
    icon: React.ReactNode;
    description: string;
    animatePulse?: boolean;
  }
> = {
  Pendiente: {
    textColor: 'text-yellow-800',
    bgColor: 'bg-yellow-100',
    icon: <Clock className="inline-block mr-1 h-4 w-4 align-text-bottom" aria-hidden="true" />,
    description: 'La factura está pendiente de pago',
  },
  Pagada: {
    textColor: 'text-green-800',
    bgColor: 'bg-green-100',
    icon: <CheckCircle2 className="inline-block mr-1 h-4 w-4 align-text-bottom" aria-hidden="true" />,
    description: 'La factura ha sido pagada',
  },
  Vencida: {
    textColor: 'text-red-800',
    bgColor: 'bg-red-100',
    icon: <AlertTriangle className="inline-block mr-1 h-4 w-4 align-text-bottom" aria-hidden="true" />,
    description: 'La factura está vencida',
    animatePulse: true,
  },
};

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const config = statusConfig[status] ?? {
    textColor: 'text-gray-700',
    bgColor: 'bg-gray-200',
    icon: null,
    description: 'Estado desconocido',
  };

  return (
    <span
      role="status"
      aria-label={config.description}
      title={config.description}
      className={`
        inline-flex
        items-center
        px-2
        py-1
        rounded-full
        text-xs
        font-semibold
        select-none
        transition
        duration-300
        ease-in-out
        ${config.bgColor} ${config.textColor}
        ${config.animatePulse ? 'animate-pulse' : ''}
      `}
    >
      {config.icon}
      {status}
    </span>
  );
};
