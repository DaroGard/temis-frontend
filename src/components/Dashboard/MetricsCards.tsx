import { FileText, DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import React from 'react';
import { StatCard } from "~/components/ui/StatCard";

// Interfaz para las propiedades de una sola tarjeta
interface MetricCardConfig {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
    iconBgColor: string;
    key: 'activeCases' | 'pendingInvoices' | 'todayAppointments' | 'urgentTasks';
}

// Interfaz para las métricas del dashboard
interface MetricsCardsProps {
    metrics: {
        activeCases: number;
        pendingInvoices: number;
        todayAppointments: number;
        urgentTasks: number;
    };
}

// Configuraciones de las tarjetas del dashboard
const metricCardConfigs: MetricCardConfig[] = [
    {
        title: "Casos Activos",
        subtitle: "+2 esta semana",
        icon: <FileText size={32} />,
        bgColor: "bg-amber-100",
        textColor: "text-amber-800",
        iconBgColor: "bg-yellow-500",
        key: 'activeCases',
    },
    {
        title: "Facturas Pendientes",
        subtitle: "Vence en 5 días",
        icon: <DollarSign size={32} />,
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        iconBgColor: "bg-blue-500",
        key: 'pendingInvoices',
    },
    {
        title: "Citas Hoy",
        subtitle: "Próxima a las 14:00",
        icon: <Calendar size={32} />,
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        iconBgColor: "bg-green-500",
        key: 'todayAppointments',
    },
    {
        title: "Tareas Urgentes",
        subtitle: "Requieren atención",
        icon: <AlertTriangle size={32} />,
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        iconBgColor: "bg-red-500",
        key: 'urgentTasks',
    },
];

// Componente de tarjetas de métricas del dashboard
const MetricsCards = ({ metrics }: MetricsCardsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricCardConfigs.map((config) => (
                <StatCard
                    key={config.key}
                    title={config.title}
                    subtitle={config.subtitle}
                    icon={config.icon}
                    bgColor={config.bgColor}
                    textColor={config.textColor}
                    iconBgColor={config.iconBgColor}
                    value={metrics[config.key]}
                />
            ))}
        </div>
    );
};

export default MetricsCards;
