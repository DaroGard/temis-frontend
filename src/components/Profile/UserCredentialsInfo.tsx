import React from 'react'
import { BadgeInfo } from 'lucide-react'

interface Props {
  dni: string
  username: string
}

export const UserCredentialsInfo: React.FC<Props> = ({ dni, username }) => (
  <div className="mb-6 bg-slate-50 rounded-lg border border-slate-200 p-4">
    <div className="flex items-center gap-2 mb-2">
      <BadgeInfo className="text-blue-600 w-5 h-5" />
      <h2 className="text-base font-semibold text-slate-900">Identificación del usuario</h2>
    </div>

    <ul className="text-sm text-slate-700 space-y-2 mt-2">
      <li className="flex items-center gap-2">
        <span className="text-slate-500 font-medium w-20">DNI:</span>
        <span>{dni}</span>
      </li>
      <li className="flex items-center gap-2">
        <span className="text-slate-500 font-medium w-20">Usuario:</span>
        <span>@{username}</span>
      </li>
    </ul>
  </div>
)
