import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CreateCaseFormData } from "~/types/cases";

type Props = {
  register: UseFormRegister<CreateCaseFormData>;
  errors?: FieldErrors<CreateCaseFormData>;
};

export function BasicInfoCard({ register, errors }: Props) {
  return (
    <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Información Básica</h3>
        <p className="text-sm text-slate-600 mt-1">Datos principales del caso legal</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Número de caso */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Número de Caso
          </label>
          <input
            type="text"
            {...register("caseNumber")}
            placeholder="Opcional - se generará automáticamente"
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-slate-500 mt-1">
            Si no se especifica, se generará automáticamente
          </p>
        </div>

        {/* Fecha de inicio */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Fecha de Inicio *
          </label>
          <input
            type="date"
            {...register("startDate")}
            className={`w-full border rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors?.startDate ? 'border-red-500 ring-red-200' : 'border-slate-300'
            }`}
          />
          {errors?.startDate && (
            <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>
          )}
        </div>

        {/* Título del caso */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Título del Caso *
          </label>
          <input
            type="text"
            {...register("title")}
            placeholder="Ej. López vs. Martínez"
            className={`w-full border rounded-md px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors?.title ? 'border-red-500 ring-red-200' : 'border-slate-300'
            }`}
          />
          {errors?.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Prioridad */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Prioridad *
          </label>
          <select
            {...register("priority")}
            className={`w-full border rounded-md px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors?.priority ? 'border-red-500 ring-red-200' : 'border-slate-300'
            }`}
          >
            <option value="">Selecciona la prioridad</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
          {errors?.priority && (
            <p className="text-red-500 text-xs mt-1">{errors.priority.message}</p>
          )}
        </div>

        {/* Tipo de caso */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tipo de Caso *
          </label>
          <select
            {...register("caseType")}
            className={`w-full border rounded-md px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors?.caseType ? 'border-red-500 ring-red-200' : 'border-slate-300'
            }`}
          >
            <option value="">Selecciona el tipo</option>
            <option value="penal">Penal</option>
            <option value="civil">Civil</option>
            <option value="laboral">Laboral</option>
            <option value="familiar">Familiar</option>
          </select>
          {errors?.caseType && (
            <p className="text-red-500 text-xs mt-1">{errors.caseType.message}</p>
          )}
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Descripción del Caso *
          </label>
          <textarea
            {...register("description")}
            placeholder="Describe los detalles del caso, antecedentes, situación actual..."
            rows={4}
            className={`w-full border rounded-md px-3 py-2 text-slate-900 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors?.description ? 'border-red-500 ring-red-200' : 'border-slate-300'
            }`}
          />
          {errors?.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>
      </div>
    </section>
  );
}