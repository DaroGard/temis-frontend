import { motion } from 'framer-motion'
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
  return new Promise(resolve =>
    setTimeout(() => resolve({ token: 'MOCK_TOKEN' }), 1000)
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
      navigate({ to: '/routes/dashboard' })
    },
    onError: (error) => console.error(error),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  })

  const onSubmit = (values: LoginFormInputs) => {
    const formData = new FormData()
    formData.set('username', values.email)
    formData.set('password', values.password)
    mutation.mutate(formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-[520px] h-auto rounded-2xl overflow-hidden shadow-2xl bg-white text-[var(--primary-color)] font-[var(--font-sans)]"
      style={{ left: '-190px' }}
    >
      <div className="bg-gradient-to-r from-[var(--primary-color)] to-gray-900 px-12 py-8 text-white">
        <div className="flex justify-center">
          <img src={logo} alt="LogoTemis" className="h-24 w-auto" />
        </div>
      </div>

      <div className="px-12 py-12">
        <h2 className="text-3xl font-semibold text-center mb-2 font-[var(--font-serif)]">
          Bienvenido
        </h2>
        <p className="text-center text-gray-600 mb-8 text-base">
          Por favor, introduzca su información para iniciar sesión...
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          <div>
            <label htmlFor="email" className="block text-sm mb-2 text-gray-700">
              Correo
            </label>
            <input
              id="email"
              {...register('email')}
              type="email"
              placeholder="Ingrese su correo..."
              className={`w-full px-5 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] ${
                errors.email ? 'border-[var(--warning-color)]' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-sm text-[var(--warning-color)] mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-2 text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              {...register('password')}
              type="password"
              placeholder="********"
              className={`w-full px-5 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] ${
                errors.password ? 'border-[var(--warning-color)]' : 'border-gray-300'
              }`}
            />
            {errors.password && (
              <p className="text-sm text-[var(--warning-color)] mt-2">
                {errors.password.message}
              </p>
            )}
            <div className="text-right mt-2">
              {/* Aquí puedes descomentar para activar "Olvidé contraseña" */}
              {/* <Link
                to="/forgot-password"
                className="text-sm text-[var(--links-color)] hover:underline"
              >
                Olvidé la contraseña
              </Link> */}
            </div>
          </div>

          {mutation.status === 'error' && (
            <div className="text-sm text-[var(--warning-color)]">
              {(mutation.error as Error).message}
            </div>
          )}

          <button
            type="submit"
            disabled={mutation.status === 'pending'}
            className="w-full py-3 rounded-md font-medium bg-[var(--primary-color)] text-[var(--secondary-color)] shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:bg-[var(--primary-color)]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.status === 'pending' ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          ¿Aún no tienes una cuenta?{' '}
          <Link
            to="/signup"
            className="text-[var(--links-color)] font-medium hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </motion.div>
  )
}