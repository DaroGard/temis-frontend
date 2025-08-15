import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CreateCaseFormData } from "~/types/cases";

type Props = {
  register: UseFormRegister<CreateCaseFormData>;
  errors?: FieldErrors<CreateCaseFormData>;
};

export function ScheduleCard({ register, errors }: Props) {
  return (
    <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Agenda</h3>
        <p className="text-sm text-slate-600 mt-1">Programar reuniones y eventos relacionados con el caso</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Primera Reunión
          </label>
          <input
            type="date"
            {...register("firstMeeting")}
            className={`w-full border rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors?.firstMeeting ? 'border-red-500 ring-red-200' : 'border-slate-300'
            }`}
          />
          {errors?.firstMeeting && (
            <p className="text-red-500 text-xs mt-1">{errors.firstMeeting.message}</p>
          )}
          <p className="text-xs text-slate-500 mt-1">
            Opcional - Puedes programar reuniones más tarde
          </p>
        </div>

        {/* Espacio para futuros campos de agenda */}
        <div className="flex items-center justify-center border-2 border-dashed border-slate-300 rounded-md p-8">
          <div className="text-center text-slate-400">
            <svg className="mx-auto h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="text-xs">Más opciones de agenda próximamente</p>
          </div>
        </div>
      </div>
    </section>
  );
}