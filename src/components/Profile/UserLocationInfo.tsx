import React from 'react'
import { MapPin } from 'lucide-react'

interface Props {
  city?: string
  state?: string
}

export const UserLocationInfo: React.FC<Props> = ({ city, state }) => {
  const hasData = city || state
  return (
    <div className="mb-6 p-6 bg-[var(--Tertiary-color)]/70 backdrop-blur-md rounded-2xl border border-[var(--primary-color)] shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1">
      <div className="flex items-center gap-3 mb-3">
        <MapPin className="w-5 h-5 text-[var(--links-color)]" />
        <h2 className="text-base font-semibold text-[var(--links-color)]">Ubicación</h2>
      </div>
      {hasData ? (
        <ul className="text-sm text-[var(--primary-color)] space-y-2 mt-2">
          {city && (
            <li className="flex items-center gap-2">
              <span className="text-[var(--links-color)] font-medium w-20">Ciudad:</span>
              <span>{city}</span>
            </li>
          )}
          {state && (
            <li className="flex items-center gap-2">
              <span className="text-[var(--links-color)] font-medium w-20">Estado:</span>
              <span>{state}</span>
            </li>
          )}
        </ul>
      ) : (
        <p className="text-sm italic text-gray-400 mt-2">No especificada</p>
      )}
    </div>
  )
}