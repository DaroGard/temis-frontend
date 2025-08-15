import React from "react";
import { LegalCase } from "~/types/cases";
import { cn } from "~/utils/utils";
import { User, Calendar, FileText, SquarePen, Eye } from "lucide-react";
import { Button } from "../generals/button";
import { useNavigate } from "@tanstack/react-router";

interface CaseCardProps {
  caseItem: LegalCase;
  onEdit?: (caseItem: LegalCase) => void;
}

const statusClasses: Record<LegalCase['status'], string> = {
  activo: "bg-blue-100 text-blue-800",
  victoria: "bg-green-100 text-green-800",
  derrota: "bg-red-100 text-red-800",
  conciliacion: "bg-purple-100 text-purple-800",
};

const statusLabels: Record<LegalCase['status'], string> = {
  activo: "Activo",
  victoria: "Victoria",
  derrota: "Derrota",
  conciliacion: "Conciliación",
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const getDaysAgo = (dateString: string): string => {
  try {
    const today = new Date();
    const targetDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - targetDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "hoy";
    if (diffDays === 1) return "ayer";
    if (diffDays > 1) return `hace ${diffDays} días`;
    return "";
  } catch {
    return "";
  }
};

const CaseCard: React.FC<CaseCardProps> = ({ caseItem, onEdit }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold text-gray-700">
          <span className="text-gray-500 font-normal mr-1">#</span>
          {caseItem.case_number}
        </h3>
        <span
          className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold",
            statusClasses[caseItem.status] || "bg-gray-100 text-gray-800" // Fallback para estados no reconocidos
          )}
        >
          {statusLabels[caseItem.status] || caseItem.status}
        </span>
      </div>

      <h2 className="text-lg font-bold text-slate-800 mb-2 truncate">
        {caseItem.title}
      </h2>

      <div className="text-gray-600 text-sm space-y-2 mb-4">
        <p className="flex items-center">
          <User size={16} className="mr-2 text-gray-500" />
          {caseItem.client?.name ?? "Cliente Desconocido"}
        </p>
        <p className="flex items-center">
          <FileText size={16} className="mr-2 text-gray-500" />
          {caseItem.case_type}
        </p>
        <p className="flex items-center">
          <Calendar size={16} className="mr-2 text-gray-500" />
          Inicio: {formatDate(caseItem.start_date)}
          <span className="ml-2 text-gray-500 text-xs">
            ({getDaysAgo(caseItem.start_date)})
          </span>
        </p>
        {caseItem.end_date && (
          <p className="flex items-center">
            <Calendar size={16} className="mr-2 text-gray-500" />
            Fin: {formatDate(caseItem.end_date)}
          </p>
        )}
      </div>

      <div className="flex space-x-3">
        <Button
          variant="default"
          size="sm"
          className="flex-grow bg-[var(--primary-color)] text-white"
          onClick={() =>
            navigate({ to: '/$caseId', params: { caseId: String(caseItem.id) } })
          }
        >
          <Eye size={16} className="mr-2" />
          Ver
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-grow text-black"
          onClick={() => onEdit && onEdit(caseItem)}
        >
          <SquarePen size={16} className="mr-2" />
          Editar
        </Button>
      </div>
    </div>
  );
};

export default CaseCard;