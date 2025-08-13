import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import logo from '~/assets/logos/logotemis.svg'

// Tipos de formulario
interface LoginFormInputs {
  username: string
  password: string
}

// Esquema de validación Zod
const loginSchema = z.object({
  username: z.string().nonempty('Requerido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').nonempty('Requerido'),
})

// Función de login
const postLogin = async (formData: FormData): Promise<void> => {
  const response = await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    body: new URLSearchParams(formData as any),
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  if (!response.ok) {
    let message = 'Credenciales incorrectas'
    try {
      const data = await response.json()
      if (data.detail) message = data.detail
    } catch { }
    throw new Error(message)
  }

  return
}

export default function LoginForm() {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: postLogin,
    onSuccess: () => navigate({ to: '/dashboard' }),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  })

  const onSubmit = (values: LoginFormInputs) => {
    clearErrors()
    const formData = new FormData()
    formData.set('username', values.username)
    formData.set('password', values.password)
    mutation.mutate(formData, {
      onError: (error: any) => {
        setError('password', { message: error.message })
      },
    })
  }

  const isLoading = mutation.isPending

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative max-w-[460px] min-h-[765px] rounded-2xl overflow-hidden shadow-2xl bg-white font-sans ml-12"
      role="form"
      aria-labelledby="login-title"
      aria-describedby="login-description"
      aria-busy={isLoading}
      aria-disabled={isLoading}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--primary-color)] to-gray-900 px-14 py-6 flex justify-center items-center rounded-t-2xl">
        <img src={logo} alt="LogoTemis" className="h-28 w-auto" />
      </div>

      {/* Contenido del formulario */}
      <div className="pt-12 p-8">
        <h2 id="login-title" className="text-4xl text-center mb-4 font-serif text-primary">
          Bienvenido
        </h2>
        <p id="login-description" className="text-center text-gray-600 mb-10 text-base">
          Por favor, introduzca su información para iniciar sesión...
        </p>

        <div className="space-y-9">
          {/* Usuario */}
          <div>
            <label htmlFor="username" className="block text-sm mb-3 text-gray-700 font-medium">
              Nombre de Usuario
            </label>
            <input
              id="username"
              type="text"
              placeholder="Ingrese su nombre de usuario..."
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? 'username-error' : undefined}
              {...register('username')}
              className={`text-black w-full px-5 py-4 border-b-2 rounded-t-md text-lg transition-colors duration-300 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-[var(--primary-color)] ${errors.username ? 'border-[var(--warning-color)] placeholder:text-[var(--warning-color)]' : 'border-gray-300'
                }`}
            />
            <AnimatePresence>
              {errors.username && (
                <motion.p
                  id="username-error"
                  className="text-sm text-[var(--warning-color)] mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  role="alert"
                >
                  {errors.username.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm mb-3 text-gray-700 font-medium">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              {...register('password')}
              className={`text-black w-full px-5 py-4 border-b-2 rounded-b-md text-lg transition-colors duration-300 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-[var(--primary-color)] ${errors.password ? 'border-[var(--warning-color)] placeholder:text-[var(--warning-color)]' : 'border-gray-300'
                }`}
            />
            <AnimatePresence>
              {errors.password && (
                <motion.p
                  id="password-error"
                  className="text-sm text-[var(--warning-color)] mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  role="alert"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Error global */}
          <AnimatePresence>
            {mutation.isError && !errors.password && (
              <motion.div
                className="text-sm text-[var(--warning-color)] text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="alert"
                aria-live="assertive"
              >
                {(mutation.error as Error).message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botón enviar */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl font-semibold bg-[var(--primary-color)] text-[var(--secondary-color)] shadow-lg transition-transform duration-300 transform hover:scale-[1.04] hover:shadow-xl hover:bg-[var(--primary-color)]/90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[var(--primary-color)] focus:ring-opacity-50"
          >
            {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </div>

        {/* Registro */}
        <p className="text-center text-sm text-gray-600 mt-10">
          ¿Aún no tienes una cuenta?{' '}
          <Link
            to="/signup"
            className="text-[var(--links-color)] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--links-color)] focus:ring-opacity-50"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </motion.form>
  )
}