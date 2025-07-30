import { useState } from "react";

type Props = {
  register: any;
};

export function ClientInfoCard({ register }: Props) {
  const [isNewClient, setIsNewClient] = useState(true);

  return (
    <section className="section-card">
      <div className="section-header mb-4">
        <h3 className="section-title">Información del Cliente</h3>
      </div>
      {/* Alternar entre nuevo/existente */}
      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="radio"
            name="clientType"
            checked={isNewClient}
            onChange={() => setIsNewClient(true)}
          />
          Nuevo Cliente
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="radio"
            name="clientType"
            checked={!isNewClient}
            onChange={() => setIsNewClient(false)}
          />
          Cliente existente
        </label>
      </div>
      {/* Formulario para nuevo cliente */}
      {isNewClient ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Primer Nombre */}
          <div>
            <label className="text-sm font-medium text-gray-700">Primer Nombre *</label>
            <input
              type="text"
              {...register("clientFirstName")}
              placeholder="Ej. Juan"
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
            />
          </div>
          {/* Primer Apellido */}
          <div>
            <label className="text-sm font-medium text-gray-700">Primer Apellido *</label>
            <input
              type="text"
              {...register("clientLastName")}
              placeholder="Ej. Pérez"
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
            />
          </div>
          {/* DNI */}
          <div>
            <label className="text-sm font-medium text-gray-700">DNI del Cliente *</label>
            <input
              type="text"
              {...register("clientDni")}
              placeholder="Ej. 0801199901234"
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
            />
          </div>
          {/* Género */}
          <div>
            <label className="text-sm font-medium text-gray-700">Género *</label>
            <select
              {...register("clientGender")}
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900 bg-white"
            >
              <option value="">Selecciona una opción</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
              <option value="no_especifica">Prefiere no decirlo</option>
            </select>
          </div>
          {/* Teléfono principal */}
          <div>
            <label className="text-sm font-medium text-gray-700">Teléfono del Cliente *</label>
            <input
              type="tel"
              {...register("clientPhone")}
              placeholder="Ej. 9999-9999"
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
            />
          </div>
          {/* Teléfono secundario */}
          <div>
            <label className="text-sm font-medium text-gray-700">Teléfono Secundario</label>
            <input
              type="tel"
              {...register("clientPhoneAlt")}
              placeholder="Otro número de contacto"
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
            />
          </div>
          {/* Correo */}
          <div>
            <label className="text-sm font-medium text-gray-700">Correo Electrónico *</label>
            <input
              type="email"
              {...register("clientEmail")}
              placeholder="cliente@email.com"
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
            />
          </div>
          {/* Dirección */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Dirección del Cliente</label>
            <input
              type="text"
              {...register("clientAddress")}
              placeholder="Dirección completa"
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900"
            />
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-sm text-slate-600">
          Buscar cliente existente...
        </div>
      )}
    </section>
  );
}