import { useParams } from '@tanstack/react-router'
import { LegalCase } from '~/types/cases'
import { useEffect, useState } from 'react'
import { Navbar } from '~/components/layout/user/UserNavbar'
import Footer from '~/components/layout/user/UserFooter'
import { ArrowLeft, Calendar, FileText, User } from 'lucide-react'
import { Button } from '~/components/generals/button'
import { motion } from 'framer-motion'
import CaseEditModal from '~/components/Cases/CaseDetail/CaseEditModal' 

const mockCasesData: LegalCase[] = [
  {
    id: 1,
    title: 'Divorcio – Familia García',
    case_number: 'FAM-2023-001',
    case_type: 'Divorcio',
    start_date: '2023-05-01',
    end_date: '',
    status: 'pendiente',
    priority_level: 'alta',
    description: 'Proceso de divorcio con custodia compartida en disputa.',
    notes: 'Cliente requiere actualizaciones semanales.',
    client: {
      name: 'María García',
      email: 'maria.garcia@example.com',
      phone_1: '9999-1234',
      phone_2: '',
      address: 'Col. Centro, Tegucigalpa',
      dni: '0801-1990-12345',
      id: 0,
    },
    account_id: 0,
    client_id: 0,
  },
  {
    id: 2,
    title: 'Reclamación de herencia – Familia López',
    case_number: 'HER-2023-002',
    case_type: 'Herencia',
    start_date: '2023-03-15',
    end_date: '',
    status: 'activo',
    priority_level: 'media',
    description: 'Disputa por la repartición de bienes familiares.',
    notes: 'Reuniones mensuales programadas con cliente.',
    client: {
      name: 'Carlos López',
      email: 'carlos.lopez@example.com',
      phone_1: '8888-5678',
      phone_2: '7777-1234',
      address: 'Col. La Rivera, San Pedro',
      dni: '0801-1985-98765',
      id: 1,
    },
    account_id: 0,
    client_id: 1,
  },
  {
    id: 3,
    title: 'Contrato de arrendamiento – Empresa XYZ',
    case_number: 'CON-2023-003',
    case_type: 'Contrato',
    start_date: '2023-01-20',
    end_date: '2023-12-31',
    status: 'cerrado',
    priority_level: 'baja',
    description: 'Renovación y revisión del contrato de arrendamiento.',
    notes: '',
    client: {
      name: 'Empresa XYZ',
      email: 'contacto@empresaxyz.com',
      phone_1: '6666-9999',
      phone_2: '',
      address: 'Av. Central 123, Tegucigalpa',
      dni: '',
      id: 2,
    },
    account_id: 0,
    client_id: 2,
  },
  {
    id: 4,
    title: 'Asesoría legal – Startup Innovatech',
    case_number: 'ASE-2023-004',
    case_type: 'Asesoría',
    start_date: '2023-06-10',
    end_date: '',
    status: 'urgente',
    priority_level: 'alta',
    description: 'Asesoría en temas legales para lanzamiento de producto.',
    notes: 'Reuniones diarias durante la primera semana.',
    client: {
      name: 'Innovatech S.A.',
      email: 'legal@innovatech.com',
      phone_1: '5555-4321',
      phone_2: '5555-4322',
      address: 'Parque Industrial, Tegucigalpa',
      dni: '',
      id: 3,
    },
    account_id: 0,
    client_id: 3,
  },
]

export default function CaseDetailPage() {
  const params = useParams({ from: '/$caseId' })
  const caseId = params.caseId as string | undefined

  const [caseItem, setCaseItem] = useState<LegalCase | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    if (!caseId) return
    const found = mockCasesData.find((c) => String(c.id) === caseId)
    setCaseItem(found || null)
  }, [caseId])

  function handleSaveCase(updatedData: Partial<LegalCase>) {
    setCaseItem(prev => (prev ? { ...prev, ...updatedData } : prev))
    setIsEditModalOpen(false)
  }

  if (!caseItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="p-6 text-slate-600 text-lg">Caso no encontrado</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="px-6 pt-4 max-w-6xl mx-auto w-full">
        <a
          href="/cases"
          className="inline-flex items-center text-sm text-slate-700 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a Casos
        </a>
      </div>

      <main className="container max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
        <header>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl font-extrabold text-slate-900 mb-1"
          >
            {caseItem.title}
          </motion.h1>
          <p className="text-slate-600 text-lg font-medium">
            #{caseItem.case_number} – {caseItem.case_type}
          </p>
        </header>

        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6 border-b pb-2">Detalles del caso</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 text-gray-700 text-base">
            <div className="space-y-4">
              <p className="flex items-center gap-3">
                <Calendar size={20} className="text-gray-400" />
                <span>
                  <span className="font-semibold">Inicio:</span> {caseItem.start_date}
                </span>
              </p>
              {caseItem.end_date && (
                <p className="flex items-center gap-3">
                  <Calendar size={20} className="text-gray-400" />
                  <span>
                    <span className="font-semibold">Fin:</span> {caseItem.end_date}
                  </span>
                </p>
              )}
              <p className="flex items-center gap-3">
                <FileText size={20} className="text-gray-400" />
                <span>
                  <span className="font-semibold">Prioridad:</span>{' '}
                  <span
                    className={
                      caseItem.priority_level === 'alta'
                        ? 'text-red-600 font-bold'
                        : caseItem.priority_level === 'media'
                        ? 'text-yellow-600 font-semibold'
                        : 'text-green-600 font-semibold'
                    }
                  >
                    {caseItem.priority_level.charAt(0).toUpperCase() + caseItem.priority_level.slice(1)}
                  </span>
                </span>
              </p>
              <p className="italic text-sm text-gray-500 mt-2">
                Estado actual:{' '}
                <span className="font-semibold text-gray-800 capitalize">{caseItem.status}</span>
              </p>
            </div>

            <div>
              <p className="text-gray-700">{caseItem.description}</p>
              {caseItem.notes && (
                <div className="bg-slate-100 p-4 rounded-md mt-6 text-slate-600 text-sm border border-slate-300 shadow-sm">
                  <strong>Notas:</strong> {caseItem.notes}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6 border-b pb-2">Información del cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 text-gray-700 text-base">
            <p className="flex items-center gap-2">
              <User size={20} className="text-gray-400" />
              <span className="font-semibold">{caseItem.client?.name ?? 'No asignado'}</span>
            </p>
            <p>
              <span className="font-semibold">Email:</span> {caseItem.client?.email}
            </p>
            <p>
              <span className="font-semibold">Teléfono:</span> {caseItem.client?.phone_1}
            </p>
            {caseItem.client?.phone_2 && (
              <p>
                <span className="font-semibold">Teléfono 2:</span> {caseItem.client.phone_2}
              </p>
            )}
            <p>
              <span className="font-semibold">Dirección:</span> {caseItem.client?.address}
            </p>
            <p>
              <span className="font-semibold">DNI:</span> {caseItem.client?.dni}
            </p>
          </div>
        </section>

        <div className="flex gap-4 justify-start">
          <Button
            variant="outline"
            className="px-8 py-3 hover:scale-105 transition-transform duration-300"
            onClick={() => setIsEditModalOpen(true)}
          >
            Editar
          </Button>
          <Button className="bg-[var(--primary-color)] text-white px-8 py-3 hover:scale-105 transition-transform duration-300">
            Cerrar caso
          </Button>
        </div>
      </main>

      <CaseEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        caseData={caseItem}
        onSave={handleSaveCase}
      />

      <Footer />
    </div>
  )
}