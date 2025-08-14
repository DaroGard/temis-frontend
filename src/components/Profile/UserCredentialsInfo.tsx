import React from 'react'
import { BadgeInfo } from 'lucide-react'

interface Props {
  dni: string
  username: string
}

export const UserCredentialsInfo: React.FC<Props> = ({ dni, username }) => (
  <div className="mb-6 p-6 bg-[var(--Tertiary-color)]/70 backdrop-blur-md rounded-2xl border border-[var(--primary-color)] shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1">
    <div className="flex items-center gap-3 mb-3">
      <BadgeInfo className="w-5 h-5 text-[var(--links-color)]" />
      <h2 className="text-base font-semibold text-[var(--links-color)]">Identificación del usuario</h2>
    </div>
    <ul className="text-sm text-[var(--primary-color)] space-y-2 mt-2">
      <li className="flex items-center gap-2">
        <span className="text-[var(--links-color)] font-medium w-24">DNI:</span>
        <span>{dni}</span>
      </li>
      <li className="flex items-center gap-2">
        <span className="text-[var(--links-color)] font-medium w-24">Usuario:</span>
        <span>@{username}</span>
      </li>
    </ul>
  </div>
)