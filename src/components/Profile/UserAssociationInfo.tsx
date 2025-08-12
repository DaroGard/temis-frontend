import React from 'react'
import { Briefcase } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  association?: string
}

export const UserAssociationInfo: React.FC<Props> = ({ association }) => {
  const hasAssociation = Boolean(association)

  return (
    <div className="mb-6 bg-slate-50 rounded-lg border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Briefcase className="text-blue-600 w-5 h-5" />
        <h2 className="text-base font-semibold text-slate-900">Asociación profesional</h2>
      </div>

      <p
        className={clsx(
          'text-sm',
          hasAssociation ? 'text-slate-700' : 'italic text-slate-400'
        )}
      >
        {association || 'No especificada'}
      </p>
    </div>
  )
}