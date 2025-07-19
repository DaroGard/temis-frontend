import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'

export default function LoginForm() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-[480px] h-[744px] rounded-2xl overflow-hidden shadow-2xl bg-white text-[var(--primary-color)] font-[var(--font-sans)]"
            style={{ left: '-190px' }}
        >
            <div className="bg-gradient-to-r from-[var(--primary-color)] to-gray-900 px-8 py-6 text-white">
                <div className="flex justify-center">
                    <img src="" alt="LogoTemis" />
                </div>
            </div>

            {/* Formulario */}
            <div className="px-8 py-10">
                <h2 className="text-2xl font-semibold text-center mb-1 font-[var(--font-serif)]">
                    Bienvenido
                </h2>
                <p className="text-center text-gray-600 mb-6 text-sm">
                    Por favor, introduzca su información para iniciar sesión...
                </p>

                <form className="space-y-5">
                    <div>
                        <label className="block text-sm mb-1 text-gray-700">Correo</label>
                        <input
                            type="email"
                            placeholder="Ingrese su correo..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            placeholder="********"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                        />
                        <div className="text-right mt-1">
                            <a href="#" className="text-sm text-[var(--links-color)] hover:underline">
                                Olvidé la contraseña
                            </a>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-2 rounded-md font-medium bg-[var(--primary-color)] text-[var(--secondary-color)] shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:bg-[var(--primary-color)]/90">
                        Iniciar sesión
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    ¿Aún no tienes una cuenta?{' '}
                    <Link to="/signup" className="text-[var(--links-color)] font-medium hover:underline">
                        Regístrate
                    </Link>
                </p>
            </div>
        </motion.div>
    )
}
