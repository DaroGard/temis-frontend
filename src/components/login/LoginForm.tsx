import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import logo from '~/assets/logos/LogoTemis.svg'

interface LoginFormInputs {
  email: string
  password: string
}

interface LoginResponse {
  token: string
}

const postLogin = async (formData: FormData): Promise<LoginResponse> => {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      const email = formData.get('username')
      const password = formData.get('password')
      if (email === 'test@temis.com' && password === 'password123') {
        resolve({ token: 'MOCK_TOKEN' })
      } else {
        reject(new Error('Credenciales incorrectas'))
      }
    }, 1000)
  )
}

const loginSchema = z.object({
  email: z.string().email('Correo inválido').nonempty('Requerido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').nonempty('Requerido'),
})

export default function LoginForm() {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: postLogin,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      navigate({ to: '/dashboard' })
    },
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
    formData.set('username', values.email)
    formData.set('password', values.password)
    mutation.mutate(formData, {
      onError: (error: any) => {
        setError('password', { message: error.message })
      },
    })
  }

  const isLoading = mutation.status === 'pending'

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative max-w-[460px] min-h-[765px] rounded-2xl overflow-hidden shadow-2xl bg-white text-[var(--primary-color)] font-[var(--font-sans)] ml-12"
      role="form"
      aria-labelledby="login-title"
      aria-describedby="login-description"
      aria-busy={isLoading}
      aria-disabled={isLoading}
    >
      <div className="bg-gradient-to-r from-[var(--primary-color)] to-gray-900 px-14 py-6 flex justify-center items-center rounded-t-2xl">
        <img src={logo} alt="LogoTemis" className="h-28 w-auto" />
      </div>

      <div className="pt-12 p-8">
        <h2
          id="login-title"
          className="text-4xl font-semibold text-center mb-4 font-[var(--font-serif)]"
        >
          Bienvenido
        </h2>
        <p
          id="login-description"
          className="text-center text-gray-600 mb-10 text-base"
        >
          Por favor, introduzca su información para iniciar sesión...
        </p>

        <div className="space-y-9">
          <div>
            <label
              htmlFor="email"
              className="block text-sm mb-3 text-gray-700 font-medium"
            >
              Correo
            </label>
            <input
              id="email"
              type="email"
              placeholder="Ingrese su correo..."
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email')}
              className={`w-full px-5 py-4 border-b-2 rounded-t-md focus:outline-none focus:ring-0 focus:border-[var(--primary-color)] text-lg transition-colors duration-300 placeholder:text-gray-400 ${
                errors.email
                  ? 'border-[var(--warning-color)] placeholder:text-[var(--warning-color)]'
                  : 'border-gray-300'
              }`}
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  id="email-error"
                  className="text-sm text-[var(--warning-color)] mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  role="alert"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm mb-3 text-gray-700 font-medium"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              aria-invalid={errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'password-error' : undefined}
              {...register('password')}
              className={`w-full px-5 py-4 border-b-2 rounded-b-md focus:outline-none focus:ring-0 focus:border-[var(--primary-color)] text-lg transition-colors duration-300 placeholder:text-gray-400 ${
                errors.password
                  ? 'border-[var(--warning-color)] placeholder:text-[var(--warning-color)]'
                  : 'border-gray-300'
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
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl font-semibold bg-[var(--primary-color)] text-[var(--secondary-color)] shadow-lg transition-transform duration-300 transform hover:scale-[1.04] hover:shadow-xl hover:bg-[var(--primary-color)]/90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[var(--primary-color)] focus:ring-opacity-50"
          >
            {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </div>
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