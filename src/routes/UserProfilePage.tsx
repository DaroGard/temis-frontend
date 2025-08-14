import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '~/components/layout/user/UserNavbar'
import Footer from '~/components/layout/user/UserFooter'
import { UserAvatarHeader } from '~/components/Profile/UserAvatarHeader'
import { UserContactInfo } from '~/components/Profile/UserContactInfo'
import { UserLocationInfo } from '~/components/Profile/UserLocationInfo'
import { UserAssociationInfo } from '~/components/Profile/UserAssociationInfo'
import { UserCredentialsInfo } from '~/components/Profile/UserCredentialsInfo'
import { UserProfileActions } from '~/components/Profile/UserProfileActions'
import Background from '~/assets/images/profile/profile-bg.webp'

export const Route = createFileRoute('/UserProfilePage')({
  component: UserProfile,
})

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;

interface UserProfileResponse {
  id: number
  dni: string
  username: string
  email: string
  first_name: string
  last_name: string
  association: string
  phone: string
  city: string
  status: string
  role_name: string
  account_email: string
  subscription_plan: string
  avatarUrl?: string
}

function useUserProfile() {
  const [user, setUser] = useState<UserProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_DOMAIN}/user/profile`, {
        credentials: 'include',
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.detail || 'Error al cargar el perfil')
      }

      const data = await res.json()
      setUser(data)
    } catch (err: any) {
      setError(err.message || 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return { user, loading, error, refresh: fetchProfile }
}

function UserProfile() {
  const { user, loading, error, refresh } = useUserProfile()

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col relative">
      <Navbar />

      {/* Volver */}
      <a
        href="/dashboard"
        className="fixed top-6 left-6 z-50 flex items-center text-sm font-medium text-gray-100 bg-gray-900 bg-opacity-60 backdrop-blur-md px-3 py-2 rounded-lg hover:bg-gray-800 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver
      </a>

      {/* Fondo */}
      <div
        className="absolute inset-0 bg-center bg-cover z-0"
        style={{ backgroundImage: `url(${Background})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30 z-0" />

      <main className="relative z-10 flex-grow flex justify-center items-start pt-16 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center w-full h-96">
            <p className="text-white text-lg animate-pulse">Cargando perfil...</p>
          </div>
        ) : error ? (
          <p className="text-center text-warning text-lg">{error}</p>
        ) : user ? (
          <div className="w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-8 border border-gray-200">
            <UserAvatarHeader
              name={user.first_name}
              lastName={user.last_name}
              username={user.username}
              avatarUrl={user.avatarUrl}
            />

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100">
                <UserContactInfo email={user.email} phone={user.phone} />
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100">
                <UserLocationInfo city={user.city} state={''} />
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100">
                <UserAssociationInfo association={user.association} />
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100">
                <UserCredentialsInfo dni={user.dni} username={user.username} />
              </div>
            </section>

            <div className="pt-4">
              <UserProfileActions
                user={{
                  email: user.email,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  phone: user.phone,
                  city: user.city
                }}
                apiDomain={API_DOMAIN}
                onProfileUpdated={refresh}
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-300 text-lg">No se encontró el perfil</p>
        )}
      </main>

      <Footer />
    </div>
  )
}