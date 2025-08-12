import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/login')({
  component: Login,
})
import Background from '~/assets/images/login/bglogin.webp'
import LoginForm from '~/components/login/LoginForm'
import BackButton from '~/components/generals/BackButton'

function Login() {
  return (
    <div
      className="w-screen h-screen flex items-center justify-end pr-32 bg-cover bg-no-repeat bg-right"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundColor: 'var(--primary-color)',
      }}
    >
      <BackButton></BackButton>
      <LoginForm />
    </div>
  )
}