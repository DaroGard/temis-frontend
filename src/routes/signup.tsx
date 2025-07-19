import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/signup')({
    component: SignUp,
})

import BackButton from '~/components/generals/BackButton'
import SignupForm from '~/components/signup/SignupForm'
import Background from '~/assets/images/signup/signup-bg.webp'


function SignUp() {
    return (
        <div
            className="w-screen h-screen relative bg-cover bg-no-repeat bg-right"
            style={{
                backgroundImage: `url(${Background})`,
                backgroundColor: 'var(--primary-color)',
            }}
        >
            <div className="absolute top-6 left-6">
                <BackButton />
            </div>
            <div className="w-full h-full flex justify-center items-center">
                <SignupForm />
            </div>
        </div>
    );
}