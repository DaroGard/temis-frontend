import { createFileRoute } from '@tanstack/react-router'
import Background from '~/assets/images/login/bglogin.webp'
import LoginForm from '~/components/login/LoginForm'
import BackButton from '~/components/generals/BackButton'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  return (
    <div className="w-screen h-screen relative overflow-hidden bg-[var(--primary-color)] flex items-center justify-center">

      {/* Imagen de fondo */}
      <img
        src={Background}
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover object-[center_10%]"
      />

      {/* Botón regresar */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-10">
        <BackButton />
      </div>

      {/* Formulario de login */}
      <div className="relative z-10 w-full max-w-[600px] px-6 sm:px-10 md:px-15 lg:px-15 py-9 flex flex-col items-center justify-center ml-[900px]">
        <LoginForm />
      </div>
    </div>
  )
}