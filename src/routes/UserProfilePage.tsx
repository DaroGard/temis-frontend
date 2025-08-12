import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/UserProfilePage')({
  component: UserProfile,
})

import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { UserAvatarHeader } from '~/components/Profile/UserAvatarHeader'
import { UserContactInfo } from '~/components/Profile/UserContactInfo'
import { UserLocationInfo } from '~/components/Profile/UserLocationInfo'
import { UserAssociationInfo } from '~/components/Profile/UserAssociationInfo'
import { UserCredentialsInfo } from '~/components/Profile/UserCredentialsInfo'
import { UserProfileActions } from '~/components/Profile/UserProfileActions'
import Background from '~/assets/images/profile/profile-bg.webp'

const mockUser = {
  id: 1,
  dni: '0801199901234',
  username: 'abogado123',
  password: '*****',
  email: 'juan.perez@legalapp.com',
  name: 'Juan',
  lastName: 'Pérez',
  association: 'Colegio de Abogados de Honduras',
  phone: '+504 9988-7766',
  city: 'Tegucigalpa',
  state: 'Francisco Morazán',
  avatarUrl: undefined,
}

export function UserProfile() {
  return (
    <div className="relative min-h-screen w-full">
      <div
        className="fixed inset-0 bg-center bg-cover bg-no-repeat z-[-1]"
        style={{ backgroundImage: `url(${Background})` }}
      />
      <div className="fixed inset-0 bg-black opacity-30 z-[-1]" />
      <main className="relative max-w-5xl mx-auto my-10 px-6 sm:px-8 py-10 rounded-xl shadow-md border border-slate-200 bg-white bg-opacity-90 text-slate-900 space-y-8 overflow-hidden">
        <UserAvatarHeader
          name={mockUser.name}
          lastName={mockUser.lastName}
          username={mockUser.username}
          avatarUrl={mockUser.avatarUrl}
        />
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <UserContactInfo email={mockUser.email} phone={mockUser.phone} />
          <UserLocationInfo city={mockUser.city} state={mockUser.state} />
          <UserAssociationInfo association={mockUser.association} />
          <UserCredentialsInfo dni={mockUser.dni} username={mockUser.username} />
        </section>
        <UserProfileActions />
        <div className="px-6 py-4">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-sm text-slate-700 hover:text-slate-900 transition-colors"
            type="button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </button>
        </div>
      </main>
    </div>
  )
}