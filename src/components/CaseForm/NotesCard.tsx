import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CreateCaseFormData } from "~/types/cases";

type Props = {
  register: UseFormRegister<CreateCaseFormData>;
  errors?: FieldErrors<CreateCaseFormData>;
};

export function NotesCard({ register, errors }: Props) {
  return (
    <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Notas Iniciales</h3>
        <p className="text-sm text-slate-600 mt-1">Observaciones y comentarios adicionales sobre el caso</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Notas u observaciones del caso
        </label>
        <textarea
          {...register("notes")}
          placeholder="Escriba aquí las notas, observaciones importantes, detalles adicionales del caso, estrategias iniciales, etc..."
          rows={4}
          className={`w-full border rounded-md px-3 py-2 text-slate-900 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors?.notes ? 'border-red-500 ring-red-200' : 'border-slate-300'
          }`}
        />
        {errors?.notes && (
          <p className="text-red-500 text-xs mt-1">{errors.notes.message}</p>
        )}
        <p className="text-xs text-slate-500 mt-1">
          Este campo es opcional. Puedes agregar notas más tarde.
        </p>
      </div>
    </section>
  );
}