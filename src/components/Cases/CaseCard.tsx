import React from "react";
import { LegalCase } from "~/types/cases";
import { cn } from "~/utils/utils";
import {User, Calendar, FileText, SquarePen, Eye} from 'lucide-react'
import { Button } from "../generals/button";


interface CaseCardProps {
    caseItem: LegalCase
}


const statusClasses = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    urgent: 'bg-red-100 text-red-800',
    closed: 'bg-gray-100 text-gray-800'
}

const CaseCard: React.FC<CaseCardProps> = ({ caseItem }) =>{
    const getStatusLabel = (status: LegalCase['status']) => {
        switch (status) {
            case 'active': return 'Activo';
            case 'pending': return 'Pendiente';
            case 'urgent': return 'Urgente';
            case 'closed': return 'Cerrado';
            default: return '';
        }
    }

    //fUNCION PARA FORMATEAR LA FECHA (EJ: 13 JUNIO, 2024)
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch (e) {
            console.error("Error formatting date:", dateString, e);
            return dateString; // Devuelve la cadena original si hay error
        }
    };

    // Función para calcular "Hace X días"
    const getDaysAgo = (dateString: string) => {
        try {
            const today = new Date();
            const targetDate = new Date(dateString);
            today.setHours(0, 0, 0, 0);
            targetDate.setHours(0, 0, 0, 0);

            const diffTime = today.getTime() - targetDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return 'hoy';
            if (diffDays === 1) return 'ayer';
            if (diffDays > 1) return `hace ${diffDays} días`;
            return '';
        } catch (e) {
            console.error("Error calculating days ago:", dateString, e);
            return '';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      {/* Header de la tarjeta */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-semibold text-gray-700">
                    <span className="text-gray-500 font-normal mr-1">#</span>{caseItem.case_number} {/* Usar case_number */}
                </h3>
                <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", statusClasses[caseItem.status])}>
                    {getStatusLabel(caseItem.status)}
                </span>
            </div>

      {/* Contenido principal */}
            <h2 className="text-lg font-bold text-slate-800 mb-2 truncate">
                {caseItem.title}
            </h2>

            <div className="text-gray-600 text-sm space-y-2 mb-4">
            <p className="flex items-center">
                <User size={16} className="mr-2 text-gray-500" />
                {caseItem.client?.name || 'Cliente Desconocido'} {/* Usar caseItem.client.name con optional chaining */}
            </p>
            <p className="flex items-center">
                <FileText size={16} className="mr-2 text-gray-500" />
                {caseItem.case_type} {/* Usar case_type */}
            </p>
            <p className="flex items-center">
                <Calendar size={16} className="mr-2 text-gray-500" />
                Inicio: {formatDate(caseItem.start_date)}
                <span className="ml-2 text-gray-500 text-xs">({getDaysAgo(caseItem.start_date)})</span>
            </p>
            {caseItem.end_date && ( // Mostrar fecha de fin si existe
                <p className="flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    Fin: {formatDate(caseItem.end_date)}
                </p>
            )}
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-3">
            <Button variant="default" size="sm" className="flex-grow bg-[var(--primary-color)]">
                <Eye size={16} className="mr-2" />
                    Ver
            </Button>
            <Button variant="outline" size="sm" className="flex-grow bg-blue-500 focus-visible:outline-none text-black">
                <SquarePen size={16} className="mr-2" />
                Editar
            </Button>
        </div>
    </div>
    );
};

export default CaseCard;