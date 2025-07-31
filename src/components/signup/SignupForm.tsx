import React, { useState } from "react";

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
        if (errors[name]) {
            validateField(name, value);
        }
    };

    const renderInput = (
        name: string,
        placeholder: string,
        type: string = "text"
    ) => (
        <div className="flex flex-col gap-1">
            <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={formValues[name] || ""}
                className={`w-full px-3 py-1.5 rounded-md border text-[var(--primary-color)] bg-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition ${errors[name] ? "border-[var(--warning-color)]" : "border-gray-300"
                    }`}
                onBlur={handleBlur}
                onChange={handleChange}
            />
            {errors[name] && (
                <span className="text-xs text-[var(--warning-color)]">{errors[name]}</span>
            )}
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-[var(--font-sans)] text-[var(--secondary-color)]">
            <form className="w-full max-w-xl bg-white text-black rounded-lg shadow-2xl overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-[var(--primary-color)] to-black text-secondary px-6 py-6">
                    <h2 className="text-2xl font-bold text-center">Crear cuenta</h2>
                </div>

                <div className="flex-grow px-6 py-8 space-y-8">
                    <section>
                        <h3 className="font-semibold text-gray-700 mb-3 text-base">
                            Información Personal
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderInput("nombre", "Nombre *")}
                            {renderInput("apellido", "Apellido *")}
                            {renderInput("email", "Correo Electrónico", "email")}
                            {renderInput("telefono", "(+504)", "tel")}
                        </div>
                    </section>

                    <hr className="border-gray-300" />
                    <section>
                        <h3 className="font-semibold text-gray-700 mb-3 text-base">
                            Información Profesional
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderInput("colegiatura", "Ej. 12345")}
                            {renderInput("especializacion", "Especialización *")}
                            {renderInput("firma", "Nombre del Bufete/Firma *")}
                            {renderInput("ciudad", "Ciudad *")}
                        </div>
                    </section>

                    <hr className="border-gray-300" />
                    <section>
                        <h3 className="font-semibold text-gray-700 mb-3 text-base">
                            Seguridad
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderInput("password", "Contraseña *", "password")}
                            {renderInput(
                                "confirmPassword",
                                "Confirmar Contraseña *",
                                "password"
                            )}
                        </div>
                    </section>
                    <div className="pt-6">
                        <button
                            type="submit"
                            className="w-full bg-[var(--primary-color)] hover:bg-[var(--links-color)] text-[var(--secondary-color)] font-semibold py-2.5 px-4 rounded-md transition-all duration-300 shadow-md"
                        >
                            Registrarse
                        </button>
                        <p className="text-center text-xs text-gray-600 mt-4">
                            ¿Ya tienes cuenta?{" "}
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
