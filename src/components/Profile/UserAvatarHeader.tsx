import React from 'react'
import { User2 } from 'lucide-react'

interface Props {
  name: string
  lastName: string
  username: string
  avatarUrl?: string
}

export const UserAvatarHeader: React.FC<Props> = ({ name, lastName, username, avatarUrl }) => (
  <div className="flex items-center gap-6 bg-[var(--Tertiary-color)]/70 backdrop-blur-md p-6 rounded-3xl border border-[var(--primary-color)] shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1">
    <div className="relative">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-28 h-28 rounded-full border border-[var(--primary-color)] object-cover shadow"
        />
      ) : (
        <div className="w-28 h-28 rounded-full bg-[var(--secondary-color)] flex items-center justify-center border border-[var(--primary-color)] shadow-inner">
          <User2 className="w-12 h-12 text-[var(--primary-color)]" />
        </div>
      )}
    </div>
    <div>
      <h1 className="text-3xl font-bold text-[var(--primary-color)] tracking-tight">{name} {lastName}</h1>
      <p className="text-sm text-[var(--links-color)] mt-1">@{username}</p>
    </div>
  </div>
)
