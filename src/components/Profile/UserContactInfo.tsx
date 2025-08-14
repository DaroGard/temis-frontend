import React from 'react'
import { Mail, Phone } from 'lucide-react'

interface Props {
  email: string
  phone?: string
}

export const UserContactInfo: React.FC<Props> = ({ email, phone }) => (
  <div className="mb-6 p-6 bg-[var(--Tertiary-color)]/70 backdrop-blur-md rounded-2xl border border-[var(--primary-color)] shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1">
    <div className="flex items-center gap-3 mb-3">
      <Mail className="w-5 h-5 text-[var(--links-color)]" />
      <h2 className="text-base font-semibold text-[var(--links-color)]">Información de contacto</h2>
    </div>
    <ul className="text-sm text-[var(--primary-color)] space-y-2 mt-2">
      <li className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-[var(--primary-color)]" />
        <span>{email}</span>
      </li>
      {phone && (
        <li className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-[var(--primary-color)]" />
          <span>{phone}</span>
        </li>
      )}
    </ul>
  </div>
)
