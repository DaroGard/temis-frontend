import React from 'react'
import { User2 } from 'lucide-react'

interface Props {
  name: string
  lastName: string
  username: string
  avatarUrl?: string
}

export const UserAvatarHeader: React.FC<Props> = ({ name, lastName, username, avatarUrl }) => {
  return (
    <div className="flex items-center gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
      <div className="relative">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-24 h-24 rounded-full border border-slate-300 object-cover shadow-md"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300 shadow-inner">
            <User2 className="w-10 h-10 text-slate-500" />
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          {name} {lastName}
        </h1>
        <p className="text-sm text-slate-500 mt-1">@{username}</p>
      </div>
    </div>
  )
}