import React, { JSX, useState } from "react";
import { Mail, Phone, User, Lock, Building } from "lucide-react";

export default function SignupForm() {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[0-9]{7,15}$/;

  const validateField = (name: string, value: string) => {
    let error = "";
    if (!value.trim()) {
      error = "Este campo es obligatorio";
    } else {
      if (name === "email" && !emailRegex.test(value)) {
        error = "Correo no válido";
      }
      if (name === "telefono" && !phoneRegex.test(value)) {
        error = "Teléfono no válido";
      }
      if (name === "confirmPassword" && value !== formValues["password"]) {
        error = "Las contraseñas no coinciden";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) validateField(name, value);
  };

  const renderInput = (
    name: string,
    placeholder: string,
    icon: JSX.Element,
    type: string = "text"
  ) => {
    const id = `input-${name}`;
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="sr-only">
          {placeholder}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-400">
            {icon}
          </span>
          <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={formValues[name] || ""}
            aria-invalid={!!errors[name]}
            aria-describedby={errors[name] ? `${id}-error` : undefined}
            className={`w-full pl-10 pr-3 py-2.5 rounded-lg border bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all duration-300 ${
              errors[name] ? "border-[var(--warning-color)]" : "border-gray-300"
            }`}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </div>
        {errors[name] && (
          <span
            id={`${id}-error`}
            role="alert"
            className="text-xs text-[var(--warning-color)]"
          >
            {errors[name]}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url('/ruta/a/tu/fondo.png')` }}
    >
      <form
        className="w-full max-w-xl bg-white text-black rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col transition-all duration-300"
        aria-label="Formulario de Registro"
        noValidate
      >
        <div className="bg-gradient-to-br from-[var(--primary-color)] to-gray-800 text-white px-6 py-6 shadow-inner">
          <h2 className="text-3xl font-bold text-center">Crear cuenta</h2>
        </div>

        <div className="flex-grow px-6 py-8 space-y-8">
          <section>
            <h3 className="font-semibold text-gray-700 mb-3 text-base">
              Información Personal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderInput("nombre", "Nombre *", <User size={18} />)}
              {renderInput("apellido", "Apellido *", <User size={18} />)}
              {renderInput("email", "Correo Electrónico *", <Mail size={18} />, "email")}
              {renderInput("telefono", "Teléfono (+504) *", <Phone size={18} />, "tel")}
            </div>
          </section>

          <hr className="border-t border-dashed border-gray-300 opacity-60" />

          <section>
            <h3 className="font-semibold text-gray-700 mb-3 text-base">
              Información Profesional
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderInput("Colegiatura", "Colegiatura", <User size={18} />)}
              {renderInput("especializacion", "Especialización *", <User size={18} />)}
              {renderInput("firma", "Nombre del Bufete/Firma *", <Building size={18} />)}
              {renderInput("ciudad", "Ciudad *", <Building size={18} />)}
            </div>
          </section>

          <hr className="border-t border-dashed border-gray-300 opacity-60" />

          <section>
            <h3 className="font-semibold text-gray-700 mb-3 text-base">Seguridad</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderInput("password", "Contraseña *", <Lock size={18} />, "password")}
              {renderInput("confirmPassword", "Confirmar Contraseña *", <Lock size={18} />, "password")}
            </div>
          </section>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-[var(--primary-color)] hover:bg-[var(--links-color)] text-white font-semibold py-2.5 px-4 rounded-lg transition-transform transform hover:scale-[1.015] shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]"
            >
              Registrarse
            </button>
            <p className="text-center text-xs text-gray-600 mt-4">
              ¿Ya tienes cuenta?{' '}
              <a
                href="/login"
                className="text-[var(--links-color)] underline hover:text-[var(--primary-color)]"
              >
                Inicia sesión
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
