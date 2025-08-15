import { useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CreateCaseFormData } from "~/types/cases";

type Props = {
  register: UseFormRegister<CreateCaseFormData>;
  errors?: FieldErrors<CreateCaseFormData>;
};

export function ClientInfoCard({ register, errors }: Props) {
  const [isNewClient, setIsNewClient] = useState(true);

  return (
    <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Información del Cliente</h3>
        <p className="text-sm text-slate-600 mt-1">Datos de contacto y personales del cliente</p>
      </div>
      
      {/* Alternar entre nuevo/existente */}
      <div className="flex items-center gap-6 mb-6 p-4 bg-slate-50 rounded-md">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
          <input
            type="radio"
            name="clientType"
            checked={isNewClient}
            onChange={() => setIsNewClient(true)}
            className="text-blue-600 focus:ring-blue-500"
          />
          <span>Nuevo Cliente</span>
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
          <input
            type="radio"
            name="clientType"
            checked={!isNewClient}
            onChange={() => setIsNewClient(false)}
            className="text-blue-600 focus:ring-blue-500"
          />
          <span>Cliente existente</span>
        </label>
      </div>

      {/* Formulario para nuevo cliente */}
      {isNewClient ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primer Nombre */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Primer Nombre *
            </label>
            <input
              type="text"
              {...register("clientFirstName")}
              placeholder="Ej. Juan"
              className={`w-full border rounded-md px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors?.clientFirstName ? 'border-red-500 ring-red-200' : 'border-slate-300'
              }`}
            />
            {errors?.clientFirstName && (
              <p className="text-red-500 text-xs mt-1">{errors.clientFirstName.message}</p>
            )}
          </div>

          {/* Primer Apellido */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Primer Apellido *
            </label>
            <input
              type="text"
              {...register("clientLastName")}
              placeholder="Ej. Pérez"
              className={`w-full border rounded-md px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors?.clientLastName ? 'border-red-500 ring-red-200' : 'border-slate-300'
              }`}
            />
            {errors?.clientLastName && (
              <p className="text-red-500 text-xs mt-1">{errors.clientLastName.message}</p>
            )}
          </div>

          {/* DNI */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              DNI del Cliente *
            </label>
            <input
              type="text"
              {...register("clientDni")}
              placeholder="0801199901234"
              maxLength={13}
              className={`w-full border rounded-md px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors?.clientDni ? 'border-red-500 ring-red-200' : 'border-slate-300'
              }`}
            />
            {errors?.clientDni && (
              <p className="text-red-500 text-xs mt-1">{errors.clientDni.message}</p>
            )}
            <p className="text-xs text-slate-500 mt-1">Debe tener exactamente 13 dígitos</p>
          </div>

          {/* Género */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Género *
            </label>
            <select
              {...register("clientGender")}
              className={`w-full border rounded-md px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors?.clientGender ? 'border-red-500 ring-red-200' : 'border-slate-300'
              }`}
            >
              <option value="">Selecciona una opción</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
              <option value="no_especifica">Prefiere no decirlo</option>
            </select>
            {errors?.clientGender && (
              <p className="text-red-500 text-xs mt-1">{errors.clientGender.message}</p>
            )}
          </div>

          {/* Teléfono principal */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Teléfono del Cliente *
            </label>
            <input
              type="tel"
              {...register("clientPhone")}
              placeholder="9999-9999"
              className={`w-full border rounded-md px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors?.clientPhone ? 'border-red-500 ring-red-200' : 'border-slate-300'
              }`}
            />
            {errors?.clientPhone && (
              <p className="text-red-500 text-xs mt-1">{errors.clientPhone.message}</p>
            )}
          </div>

          {/* Teléfono secundario */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Teléfono Secundario
            </label>
            <input
              type="tel"
              {...register("clientPhoneAlt")}
              placeholder="Opcional - otro número de contacto"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors?.clientPhoneAlt && (
              <p className="text-red-500 text-xs mt-1">{errors.clientPhoneAlt.message}</p>
            )}
          </div>

          {/* Correo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Correo Electrónico *
            </label>
            <input
              type="email"
              {...register("clientEmail")}
              placeholder="cliente@email.com"
              className={`w-full border rounded-md px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors?.clientEmail ? 'border-red-500 ring-red-200' : 'border-slate-300'
              }`}
            />
            {errors?.clientEmail && (
              <p className="text-red-500 text-xs mt-1">{errors.clientEmail.message}</p>
            )}
          </div>

          {/* Dirección */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Dirección del Cliente
            </label>
            <input
              type="text"
              {...register("clientAddress")}
              placeholder="Dirección completa (opcional)"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors?.clientAddress && (
              <p className="text-red-500 text-xs mt-1">{errors.clientAddress.message}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-md p-8 text-center">
          <div className="text-slate-600">
            <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Funcionalidad próximamente
            </h3>
            <p className="text-sm text-slate-600">
              La búsqueda de clientes existentes estará disponible pronto.
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Por ahora, usa "Nuevo Cliente" para continuar
            </p>
          </div>
        </div>
      )}
    </section>
  );
}