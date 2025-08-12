import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor?: string;
  iconBgColor?: string;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  bgColor,
  textColor = "text-slate-800",
  iconBgColor = "bg-slate-200"
}: StatCardProps) => {
  return (
    <div className={`${bgColor} flex justify-between rounded-xl p-6 shadow-sm border border-slate-200`}>
      <div className="flex flex-col items-start space-y-2">
        <div className={`w-10 h-10 flex items-center justify-center rounded-md ${iconBgColor}`}>
          {icon}
        </div>
        <div className={`font-semibold ${textColor}`}>
          {title}
        </div>
        {subtitle && (
          <div className={`text-sm ${textColor} opacity-70`}>
            {subtitle}
          </div>
        )}
      </div>
      <div className={`text-3xl font-bold ${textColor}`}>
        {value}
      </div>
    </div>
  );
};

export default  StatCard