// src/components/ui/Select.tsx
import React from "react";
import { cn } from "~/utils/utils";

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: SelectOption[];
    placeholder?: string;
    className?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ options, placeholder, className, value, ...props }, ref) => { // Asegúrate de extraer 'value' aquí
        return (
            <select
                className={cn(
                    "w-full h-10 px-4 pr-10 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:cursor-not-allowed",
                    className
                )}
                ref={ref}
                value={value} // <--- APLICAR EL VALOR AQUÍ
                {...props}
            >
                {placeholder && (
                    // Elimina 'selected={!props.value}' de aquí
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        );
    }
);
Select.displayName = "Select";

export { Select };