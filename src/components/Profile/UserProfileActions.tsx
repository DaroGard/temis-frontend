import React from 'react'
import { Pencil, Lock } from 'lucide-react'

export const UserProfileActions: React.FC = () => (
  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
    <button
      type="button"
      className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm text-sm font-semibold"
    >
      <Pencil className="w-4 h-4" />
      Editar Perfil
    </button>

    <button
      type="button"
      className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-slate-600 text-white hover:bg-slate-700 transition-colors shadow-sm text-sm font-semibold"
    >
      <Lock className="w-4 h-4" />
      Cambiar Contraseña
    </button>
  </div>
)
