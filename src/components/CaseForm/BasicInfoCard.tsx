type Props = {
  register: any;
};

export function BasicInfoCard({ register }: Props) {
  return (
    <section className="section-card">
      <div className="section-header">
        <h3 className="section-title">Información Básica</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Número de caso */}
        <div>
          <label className="text-sm font-medium text-gray-700">Número de Caso *</label>
          <input
            type="text"
            {...register("caseNumber")}
            placeholder="Ej. Caso-2025-001"
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
          />
        </div>
        {/* Fecha de inicio */}
        <div>
          <label className="text-sm font-medium text-gray-700">Fecha de Inicio *</label>
          <input
            type="date"
            {...register("startDate")}
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
          />
        </div>
        {/* Título del caso */}
        <div>
          <label className="text-sm font-medium text-gray-700">Título del Caso *</label>
          <input
            type="text"
            {...register("title")}
            placeholder="Ej. López vs. Martínez"
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
          />
        </div>
        {/* Prioridad */}
        <div>
          <label className="text-sm font-medium text-gray-700">Prioridad *</label>
          <select
            {...register("priority")}
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
          >
            <option value="">Selecciona la prioridad</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
        {/* Tipo de caso */}
        <div>
          <label className="text-sm font-medium text-gray-700">Tipo de Caso *</label>
          <select
            {...register("caseType")}
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
          >
            <option value="">Selecciona el tipo</option>
            <option value="penal">Penal</option>
            <option value="civil">Civil</option>
            <option value="laboral">Laboral</option>
            <option value="familiar">Familiar</option>
          </select>
        </div>
        {/* Descripción */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Descripción del Caso *</label>
          <textarea
            {...register("description")}
            placeholder="Describe los detalles del caso..."
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900 h-28 resize-none"
          />
        </div>
      </div>
    </section>
  );
}