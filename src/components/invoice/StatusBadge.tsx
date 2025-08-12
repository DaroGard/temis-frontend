import React from 'react';
import type { InvoiceStatus } from '~/types/invoice';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    textColor: 'text-yellow-900',
    bgColor: 'bg-yellow-100',
    icon: <Clock className="inline-block mr-1 h-4 w-4 align-text-bottom text-yellow-700" aria-hidden="true" />,
    description: 'La factura está pendiente de pago',
  },
  Pagada: {
    textColor: 'text-green-900',
    bgColor: 'bg-green-100',
    icon: <CheckCircle2 className="inline-block mr-1 h-4 w-4 align-text-bottom text-green-700" aria-hidden="true" />,
    description: 'La factura ha sido pagada',
  },
  Vencida: {
    textColor: 'text-red-900',
    bgColor: 'bg-red-100',
    icon: <AlertTriangle className="inline-block mr-1 h-4 w-4 align-text-bottom text-red-700" aria-hidden="true" />,
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

  const tooltipId = `status-badge-tooltip-${status.replace(/\s+/g, '').toLowerCase()}`;

  return (
    <motion.span
      role="status"
      aria-describedby={tooltipId}
      tabIndex={0}
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
        cursor-default
        transition
        duration-300
        ease-in-out
        shadow-sm
        hover:shadow-md
        hover:brightness-105
        focus:outline-none
        focus:ring-2
        focus:ring-offset-1
        focus:ring-blue-400
        ${config.bgColor} ${config.textColor}
      `}
      {...(config.animatePulse
        ? {
          animate: {
            scale: [1, 1.05, 1],
            opacity: [1, 0.85, 1],
          },
          transition: {
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }
        : {})}
    >
      {config.icon}
      {status}
      <span id={tooltipId} className="sr-only">
        {config.description}
      </span>
    </motion.span>
  );
};