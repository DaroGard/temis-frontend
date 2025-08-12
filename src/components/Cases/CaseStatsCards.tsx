import React from 'react';
import { StatCard } from "~/components/ui/StatCard"; 
import { CasesMetrics } from '~/types/cases';
import { FileText, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

interface MetricCardConfig {
    title: string;
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
    iconBgColor: string;
    key: 'total' | 'active' | 'urgent' | 'pending';
}

interface MetricsCardsProps {
    metrics: CasesMetrics;
}

// Configuraciones de las tarjetas del dashboard
const metricCardConfigs: MetricCardConfig[] = [
    {
        title: "Total Activos",
        icon: <FileText size={32} />,
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        iconBgColor: "bg-blue-500",
        key: 'total',
    },
    {
        title: "Activos",
        icon: <CheckCircle size={32} />,
        bgColor: "bg-blue-100",
        textColor: "text-green-800",
        iconBgColor: "bg-green-500",
        key: 'active',
    },
    {
        title: "Urgentes",
        icon: <AlertTriangle size={32} />,
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        iconBgColor: "bg-red-500",
        key: 'urgent',
    },
    {
        title: "pendientes",
        icon: <AlertCircle size={32} />,
        bgColor: "bg-amber-100",
        textColor: "text-amber-800",
        iconBgColor: "bg-amber-500",
        key: 'pending',
    },
];

// Componente de tarjetas de métricas del dashboard
const CasesMetricsCards = ({ metrics }: MetricsCardsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricCardConfigs.map((config) => (
                <StatCard
                    key={config.key}
                    title={config.title}
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

export default CasesMetricsCards;
