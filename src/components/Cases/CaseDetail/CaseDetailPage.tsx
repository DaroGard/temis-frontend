import { useParams } from '@tanstack/react-router'
import { LegalCase } from '~/types/cases'
import { useEffect, useState } from 'react'
import { Navbar } from '~/components/layout/user/UserNavbar'
import Footer from '~/components/layout/user/UserFooter'
import { ArrowLeft, Calendar, FileText, User, AlertCircle } from 'lucide-react'
import { Button } from '~/components/generals/button'
import { motion } from 'framer-motion'
import CaseEditModal from '~/components/Cases/CaseDetail/CaseEditModal'
import { CaseFilesCard } from './CaseFilesCard'
import type { CaseFile } from '~/components/Cases/CaseDetail/CaseFilesCard'

// Importar el servicio
import { casesService } from '~/services/casesService'

const statusLabels: Record<string, string> = {
  activo: "Activo",
  victoria: "Victoria",
  derrota: "Derrota",
  conciliacion: "Conciliación",
};

const priorityLabels: Record<string, string> = {
  normal: "Normal",
  mid: "Media", 
  high: "Alta",
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long", 
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

export default function CaseDetailPage() {
  const params = useParams({ from: '/$caseId' })
  const caseId = parseInt(params.caseId as string)

  const [caseItem, setCaseItem] = useState<LegalCase | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<CaseFile[]>([])

  // Cargar datos del caso desde la API
  useEffect(() => {
    const loadCaseData = async () => {
      if (!caseId) return
      
      try {
        setLoading(true)
        setError(null)
        
        // Cargar caso y archivos en paralelo
        const [caseData, filesData] = await Promise.all([
          casesService.getCaseById(caseId),
          casesService.getCaseFiles(caseId).catch(() => []) // No fallar si no hay archivos
        ])
        
        // Convertir caso del backend al formato del frontend
        const convertedCase = casesService.convertBackendToFrontend(caseData)
        setCaseItem(convertedCase)
        
        // Convertir archivos al formato esperado por CaseFilesCard
        const convertedFiles: CaseFile[] = filesData.map((file: any) => ({
          id: file.id.toString(),
          name: file.file_name,
          type: getFileExtension(file.file_name) as any,
          size: file.size_mb * 1024 * 1024, // Convertir MB a bytes
          uploadedAt: new Date(file.upload_date),
          url: `#file-${file.id}`, // URL temporal
        }))
        setFiles(convertedFiles)
        
      } catch (err: any) {
        setError(err.message || 'Error al cargar el caso')
        console.error('Error loading case:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCaseData()
  }, [caseId])

  const getFileExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase()
    return ext || 'file'
  }

  async function handleSaveCase(updatedData: Partial<LegalCase>) {
    if (!caseItem) return

    try {
      // Actualizar en el backend
      const backendResponse = await casesService.updateCase(caseItem.id, {
        title: updatedData.title,
        case_type: updatedData.case_type,
        status: updatedData.status,
        priority_level: updatedData.priority_level,
        description: updatedData.description,
        notes: updatedData.notes,
        start_date: updatedData.start_date,
        end_date: updatedData.end_date,
      })
      
      // Convertir la respuesta del backend al formato del frontend
      const convertedResponse = casesService.convertBackendToFrontend(backendResponse)
      
      // Actualizar estado local
      setCaseItem(convertedResponse)
      setIsEditModalOpen(false)
      
      console.log('✅ Caso actualizado exitosamente')
      
    } catch (error: any) {
      console.error('Error updating case:', error)
      // Actualizar solo localmente si falla el backend
      setCaseItem(prev => (prev ? { ...prev, ...updatedData } : prev))
      setIsEditModalOpen(false)
      alert('Los cambios se guardaron localmente pero no se pudieron sincronizar con el servidor: ' + error.message)
    }
  }

  const handleRetry = () => {
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="px-6 pt-4 max-w-6xl mx-auto w-full">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <main className="container max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
          <header className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </header>
          {[...Array(3)].map((_, i) => (
            <section key={i} className="bg-white rounded-lg shadow-md p-8 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </section>
          ))}
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !caseItem) {
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
        <main className="container max-w-6xl mx-auto px-6 py-10">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              {error ? 'Error al cargar el caso' : 'Caso no encontrado'}
            </h2>
            <p className="text-red-600 mb-4">
              {error || 'El caso solicitado no existe o no tienes permisos para verlo.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
              >
                Volver
              </Button>
              <Button onClick={handleRetry}>
                Reintentar
              </Button>
            </div>
          </div>
        </main>
        <Footer />
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
            #{caseItem.case_number} — {caseItem.case_type}
          </p>
        </header>

        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6 border-b pb-2">Detalles del caso</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 text-gray-700 text-base">
            <div className="space-y-4">
              <p className="flex items-center gap-3">
                <Calendar size={20} className="text-gray-400" />
                <span>
                  <span className="font-semibold">Inicio:</span> {formatDate(caseItem.start_date)}
                </span>
              </p>
              {caseItem.end_date && (
                <p className="flex items-center gap-3">
                  <Calendar size={20} className="text-gray-400" />
                  <span>
                    <span className="font-semibold">Fin:</span> {formatDate(caseItem.end_date)}
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
                    {priorityLabels[caseItem.priority_level] || caseItem.priority_level.charAt(0).toUpperCase() + caseItem.priority_level.slice(1)}
                  </span>
                </span>
              </p>
              <p className="italic text-sm text-gray-500 mt-2">
                Estado actual:{' '}
                <span className="font-semibold text-gray-800 capitalize">
                  {statusLabels[caseItem.status] || caseItem.status}
                </span>
              </p>
            </div>

            <div>
              <p className="text-gray-700">{caseItem.description}</p>
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
              <span className="font-semibold">Email:</span> {caseItem.client?.email || 'No disponible'}
            </p>
            <p>
              <span className="font-semibold">Teléfono:</span> {caseItem.client?.phone_1 || 'No disponible'}
            </p>
            {caseItem.client?.phone_2 && (
              <p>
                <span className="font-semibold">Teléfono 2:</span> {caseItem.client.phone_2}
              </p>
            )}
            <p>
              <span className="font-semibold">Dirección:</span> {caseItem.client?.address || 'No disponible'}
            </p>
            <p>
              <span className="font-semibold">DNI:</span> {caseItem.client?.dni || 'No disponible'}
            </p>
          </div>
        </section>

        {caseItem.notes && caseItem.notes.trim() !== "" && (
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6 border-b pb-2 flex items-center gap-2">
              <FileText className="w-6 h-6 text-slate-600" />
              Notas
            </h2>
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-300 rounded-lg shadow-sm p-6 max-h-60 overflow-y-auto whitespace-pre-line text-slate-700 leading-relaxed">
              {caseItem.notes}
            </div>
          </section>
        )}

        <section className="bg-white rounded-lg shadow-md p-8">
          <CaseFilesCard files={files} />
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