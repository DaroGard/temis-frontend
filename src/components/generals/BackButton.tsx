import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
  return (
    <div className="absolute top-6 left-6 z-50">
      <Link
        to="/"
        className="flex items-center gap-2 bg-white text-[var(--primary-color)] border border-gray-300 hover:bg-[var(--primary-color)] hover:text-white font-medium px-4 py-2 rounded-md shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]"
      >
        <ArrowLeft className="w-5 h-5" />
        Regresar
      </Link>
    </div>
  )
}
