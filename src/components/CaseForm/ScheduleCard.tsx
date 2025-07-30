type Props = {
  register: any;
};

export function ScheduleCard({ register }: Props) {
  return (
    <section className="section-card">
      <div className="section-header">
        <h3 className="section-title">Agenda</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Primera reunión</label>
          <input
            type="date"
            {...register("firstMeeting")}
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
          />
        </div>
      </div>
    </section>
  );
}