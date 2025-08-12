import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { LegalCase } from '~/types/cases'
import { Button } from '~/components/generals/button'

type PriorityLevel = 'baja' | 'media' | 'alta'
type Status = 'activo' | 'pendiente' | 'cerrado' | 'urgente'

type CaseEditModalProps = {
  isOpen: boolean
  onClose: () => void
  caseData: LegalCase
  onSave: (data: Partial<LegalCase>) => void
}

type FormData = {
  title: string
  case_number: string
  case_type: string
  start_date: string
  end_date?: string
  status: Status
  priority_level: PriorityLevel
  description: string
  notes?: string
}

export default function CaseEditModal({ isOpen, onClose, caseData, onSave }: CaseEditModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      title: caseData.title,
      case_number: caseData.case_number,
      case_type: caseData.case_type,
      start_date: caseData.start_date,
      end_date: caseData.end_date || '',
      status: caseData.status as Status,
      priority_level: caseData.priority_level as PriorityLevel,
      description: caseData.description,
      notes: caseData.notes || '',
    },
  })

  React.useEffect(() => {
    if (isOpen) {
      reset({
        title: caseData.title,
        case_number: caseData.case_number,
        case_type: caseData.case_type,
        start_date: caseData.start_date,
        end_date: caseData.end_date || '',
        status: caseData.status as Status,
        priority_level: caseData.priority_level as PriorityLevel,
        description: caseData.description,
        notes: caseData.notes || '',
      })
    }
  }, [isOpen, caseData, reset])

  function onSubmit(data: FormData) {
    const validPriorityLevels: PriorityLevel[] = ['baja', 'media', 'alta']
    const validStatuses: Status[] = ['activo', 'pendiente', 'cerrado', 'urgente']

    const mappedData: Partial<LegalCase> = {
      ...data,
      priority_level: validPriorityLevels.includes(data.priority_level) ? data.priority_level : undefined,
      status: validStatuses.includes(data.status) ? data.status : undefined,
    }

    onSave(mappedData)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative text-black"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-4 text-black">Editar Caso</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block font-medium mb-1 text-black" htmlFor="title">
                  Título
                </label>
                <input
                  id="title"
                  {...register('title', { required: 'El título es obligatorio' })}
                  className={`w-full rounded border px-3 py-2 text-black focus:outline-none focus:ring ${
                    errors.title ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
                  }`}
                  type="text"
                />
                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-black" htmlFor="case_number">
                    Número de caso
                  </label>
                  <input
                    id="case_number"
                    {...register('case_number', { required: 'El número de caso es obligatorio' })}
                    className={`w-full rounded border px-3 py-2 text-black focus:outline-none focus:ring ${
                      errors.case_number ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
                    }`}
                    type="text"
                  />
                  {errors.case_number && <p className="text-red-600 text-sm mt-1">{errors.case_number.message}</p>}
                </div>

                <div>
                  <label className="block font-medium mb-1 text-black" htmlFor="case_type">
                    Tipo de caso
                  </label>
                  <input
                    id="case_type"
                    {...register('case_type', { required: 'El tipo de caso es obligatorio' })}
                    className={`w-full rounded border px-3 py-2 text-black focus:outline-none focus:ring ${
                      errors.case_type ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
                    }`}
                    type="text"
                  />
                  {errors.case_type && <p className="text-red-600 text-sm mt-1">{errors.case_type.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-black" htmlFor="start_date">
                    Fecha inicio
                  </label>
                  <input
                    id="start_date"
                    {...register('start_date', { required: 'La fecha de inicio es obligatoria' })}
                    className={`w-full rounded border px-3 py-2 text-black focus:outline-none focus:ring ${
                      errors.start_date ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
                    }`}
                    type="date"
                  />
                  {errors.start_date && <p className="text-red-600 text-sm mt-1">{errors.start_date.message}</p>}
                </div>

                <div>
                  <label className="block font-medium mb-1 text-black" htmlFor="end_date">
                    Fecha fin
                  </label>
                  <input
                    id="end_date"
                    {...register('end_date')}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring focus:ring-blue-400"
                    type="date"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-black" htmlFor="status">
                    Estado
                  </label>
                  <select
                    id="status"
                    {...register('status', { required: 'El estado es obligatorio' })}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring focus:ring-blue-400"
                  >
                    <option value="activo">Activo</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="cerrado">Cerrado</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1 text-black" htmlFor="priority_level">
                    Prioridad
                  </label>
                  <select
                    id="priority_level"
                    {...register('priority_level', { required: 'La prioridad es obligatoria' })}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring focus:ring-blue-400"
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-black" htmlFor="description">
                  Descripción
                </label>
                <textarea
                  id="description"
                  {...register('description', { required: 'La descripción es obligatoria' })}
                  rows={4}
                  className={`w-full rounded border px-3 py-2 resize-none text-black focus:outline-none focus:ring ${
                    errors.description ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
                  }`}
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block font-medium mb-1 text-black" htmlFor="notes">
                  Notas
                </label>
                <textarea
                  id="notes"
                  {...register('notes')}
                  rows={3}
                  className="w-full rounded border border-gray-300 px-3 py-2 resize-none text-black focus:outline-none focus:ring focus:ring-blue-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  Guardar
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}