import React from 'react'
import { Mail, Phone } from 'lucide-react'

interface Props {
  email: string
  phone?: string
}

export const UserContactInfo: React.FC<Props> = ({ email, phone }) => (
  <div className="mb-6 bg-slate-50 rounded-lg border border-slate-200 p-4">
    <div className="flex items-center gap-2 mb-2">
      <Mail className="text-blue-600 w-5 h-5" />
      <h2 className="text-base font-semibold text-slate-900">Información de contacto</h2>
    </div>

    <ul className="text-sm text-slate-700 space-y-2 mt-2">
      <li className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-slate-500" />
        <span>{email}</span>
      </li>
      {phone && (
        <li className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-slate-500" />
          <span>{phone}</span>
        </li>
      )}
    </ul>
  </div>
)