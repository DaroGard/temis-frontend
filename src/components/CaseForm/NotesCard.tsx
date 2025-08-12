type Props = {
  register: any;
};

export function NotesCard({ register }: Props) {
  return (
    <section className="section-card">
      <div className="section-header">
        <h3 className="section-title">Notas iniciales</h3>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Notas u observaciones del caso</label>
        <textarea
          {...register("notes")}
          placeholder="Escriba aquí las notas, observaciones importantes, detalles del caso..."
          className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900 h-28 resize-none"
        />
      </div>
    </section>
  );
}
