{/*import { FileText, DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import React from 'react'; // Necesario para los iconos de Lucide

// Interfaz para las propiedades de una sola MetricCard  definimos que info tendra las tarjetas
interface MetricCardProps {
    title: string;
    value: number | string;
    subtitle: string;
    icon: React.ReactNode;
    bgColor: string;
    textColor?: string;
    iconBgColor?: string;
}

// El componente MetricCard estructura visual de como se vera una tarjeta
const MetricCard = ({ title, value, subtitle, icon, bgColor, textColor, iconBgColor = "text-slate-700" }: MetricCardProps) => {
    return (
        <div className={`${bgColor} flex justify-between rounded-xl p-6 shadow-sm border border-slate-200`}>
            <div className="flex items-center justify-between">
                <div className="flex flex-col items-start space-y-2">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-md ${iconBgColor}`}>
                        {icon}
                    </div>
                    <div className={`font-semibold ${textColor} mb-1`}>
                        {title}
                    </div>
                    <div className={`text-sm ${textColor} opacity-70`}>
                        {subtitle}
                    </div>
                </div>
            </div>
            <div className={`text-3xl font-bold ${textColor} mb-1`}>
                {value}
            </div>
        </div>
    );
};

//confi declarativa de los datos de la tarjeta para reenderizar
interface MetricCardConfig {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
    iconBgColor: string;
    // Esta clave nos ayudará a obtener el valor correcto del objeto `metrics`
    key: 'activeCases' | 'pendingInvoices' | 'todayAppointments' | 'urgentTasks';
}

// La interfaz para las propiedades de MetricsCards 
interface MetricsCardsProps {
    metrics: {
        activeCases: number;
        pendingInvoices: number;
        todayAppointments: number;
        urgentTasks: number;
    };
}

// El componente MetricsCards refactorizado
const MetricsCards = ({ metrics }: MetricsCardsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Usamos .map() para iterar sobre nuestro arreglo de configuraciones */}
           {/* {metricCardConfigs.map((config) => (
                <MetricCard
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

const metricCardConfigs: MetricCardConfig[] = [
    {
        title: "Casos Activos",
        subtitle: "+2 esta semana",
        icon: <FileText size={32} />,
        bgColor: "bg-amber-100",
        textColor: "text-amber-800",
        iconBgColor: "bg-yellow-500",
        key: 'activeCases', // Usa 'activeCases' para mapear al valor de `metrics.activeCases`
    },
    {
        title: "Factura Pendientes",
        subtitle: "Vence en 5 días",
        icon: <DollarSign size={32} />,
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        iconBgColor: "bg-blue-500",
        key: 'pendingInvoices', // Usa 'pendingInvoices' para mapear al valor de `metrics.pendingInvoices`
    },
    {
        title: "Citas Hoy",
        subtitle: "Próxima a las 14:00",
        icon: <Calendar size={32} />,
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        iconBgColor: "bg-green-500",
        key: 'todayAppointments', // Usa 'todayAppointments' para mapear al valor de `metrics.todayAppointments`
    },
    {
        title: "Tareas Urgentes",
        subtitle: "Requieren atención",
        icon: <AlertTriangle size={32} />,
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        iconBgColor: "bg-red-500",
        key: 'urgentTasks', // Usa 'urgentTasks' para mapear al valor de `metrics.urgentTasks`
    },
];

export default MetricsCards;*/}


// src/components/Dashboard/MetricsCards.tsx
import { FileText, DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import React from 'react';
import { StatCard } from "~/components/ui/StatCard"; // NUEVO: componente reutilizable

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
                    value={metrics[config.key]} // ← Aquí sigue funcionando igual
                />
            ))}
        </div>
    );
};

export default MetricsCards;
