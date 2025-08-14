import { createFileRoute } from '@tanstack/react-router'
import Background from '~/assets/images/login/bglogin.webp'
import LoginForm from '~/components/login/LoginForm'
import BackButton from '~/components/generals/BackButton'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  return (
    <div
      className="w-screen h-screen flex flex-col md:flex-row items-center justify-center md:justify-end relative overflow-hidden"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'var(--primary-color)',
      }}
    >
      {/* Botón regresar */}
      <div className="absolute top-8 left-8">
        <BackButton />
      </div>

      {/* Formulario de login */}
      <div className="w-full max-w-[460px] mx-10 md:mx-40">
        <LoginForm />
      </div>
    </div>
  )
}