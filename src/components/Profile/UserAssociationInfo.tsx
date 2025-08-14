import React from 'react'
import { Briefcase } from 'lucide-react'

interface Props {
  association?: string
}

export const UserAssociationInfo: React.FC<Props> = ({ association }) => {
  const hasAssociation = Boolean(association)

  return (
    <div className="mb-6 p-6 bg-[var(--Tertiary-color)]/70 backdrop-blur-md rounded-2xl border border-[var(--primary-color)] shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1">
      <div className="flex items-center gap-3 mb-3">
        <Briefcase className="w-5 h-5 text-[var(--links-color)]" />
        <h2 className="text-base font-semibold text-[var(--links-color)]">
          Asociación profesional
        </h2>
      </div>
      <p className={`text-sm ${hasAssociation ? 'text-[var(--primary-color)]' : 'italic text-gray-400'}`}>
        {association || 'No especificada'}
      </p>
    </div>
  )
}