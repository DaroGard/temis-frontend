import React from 'react'
import { MapPin } from 'lucide-react'

interface Props {
  city?: string
  state?: string
}

export const UserLocationInfo: React.FC<Props> = ({ city, state }) => {
  const hasData = city || state

  return (
    <div className="mb-6 bg-slate-50 rounded-lg border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="text-blue-600 w-5 h-5" />
        <h2 className="text-base font-semibold text-slate-900">Ubicación</h2>
      </div>

      {hasData ? (
        <ul className="text-sm text-slate-700 space-y-2 mt-2">
          {city && (
            <li className="flex items-center gap-2">
              <span className="text-slate-500 font-medium w-20">Ciudad:</span>
              <span>{city}</span>
            </li>
          )}
          {state && (
            <li className="flex items-center gap-2">
              <span className="text-slate-500 font-medium w-20">Estado:</span>
              <span>{state}</span>
            </li>
          )}
        </ul>
      ) : (
        <p className="text-sm italic text-slate-400 mt-2">No especificada</p>
      )}
    </div>
  )
}
