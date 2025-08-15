import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from 'react';

import { Navbar } from '~/components/layout/user/UserNavbar';
import { BasicInfoCard } from '~/components/CaseForm/BasicInfoCard';
import { ClientInfoCard } from '~/components/CaseForm/ClientInfoCard';
import { NotesCard } from '~/components/CaseForm/NotesCard';
import { FileUploadCard } from '~/components/CaseForm/FileUploadCard';
import { ScheduleCard } from '~/components/CaseForm/ScheduleCard';
import Footer from '~/components/layout/user/UserFooter';
import { casesService } from '~/services/casesService';

// Schema de validación simplificado
const formSchema = z.object({
  // Información básica del caso
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  caseType: z.string().min(1, "Selecciona un tipo de caso"),
  priority: z.string().min(1, "Selecciona una prioridad"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  
  // Información del cliente
  clientFirstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  clientLastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  clientDni: z.string().min(13, "El DNI debe tener 13 dígitos").max(13, "El DNI debe tener 13 dígitos"),
  clientGender: z.string().min(1, "Selecciona un género"),
  clientPhone: z.string().min(8, "Teléfono muy corto"),
  clientEmail: z.string().email("Email inválido"),
  
  // Campos opcionales
  caseNumber: z.string().optional(),
  clientPhoneAlt: z.string().optional(),
  clientAddress: z.string().optional(),
  notes: z.string().optional(),
  firstMeeting: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const Route = createFileRoute('/newCase')({
  component: NewCase,
});

function NewCase() {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    watch,
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      caseNumber: '',
      title: '',
      startDate: '',
      caseType: '',
      priority: '',
      description: '',
      clientFirstName: '',
      clientLastName: '',
      clientDni: '',
      clientGender: '',
      clientPhone: '',
      clientPhoneAlt: '',
      clientEmail: '',
      clientAddress: '',
      notes: '',
      firstMeeting: '',
    },
  });

  // Watch solo los campos necesarios para verificar completitud
  const watchedValues = watch(['title', 'startDate', 'caseType', 'priority', 'description', 'clientFirstName', 'clientLastName', 'clientDni', 'clientGender', 'clientPhone', 'clientEmail']);

  // Verificar si todos los campos requeridos están completos
  const requiredFieldsCompleted = watchedValues.every(value => value && value.trim() !== '');

  const onSubmit = async (data: FormData) => {
    console.log('🎯 Formulario enviado');
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSuccess(false);

    try {
      // Validaciones adicionales
      const validCaseTypes = ['penal', 'civil', 'laboral', 'familiar'];
      const validPriorities = ['alta', 'media', 'baja'];
      const validGenders = ['masculino', 'femenino', 'otro', 'no_especifica'];

      if (!validCaseTypes.includes(data.caseType)) {
        throw new Error('Tipo de caso no válido');
      }

      if (!validPriorities.includes(data.priority)) {
        throw new Error('Prioridad no válida');
      }

      if (!validGenders.includes(data.clientGender)) {
        throw new Error('Género no válido');
      }

      // Preparar datos para el servicio (evitando referencias circulares)
      const cleanData = {
        title: String(data.title || '').trim(),
        startDate: String(data.startDate || ''),
        caseType: String(data.caseType || ''),
        priority: String(data.priority || ''),
        description: String(data.description || '').trim(),
        notes: String(data.notes || '').trim(),
        clientFirstName: String(data.clientFirstName || '').trim(),
        clientLastName: String(data.clientLastName || '').trim(),
        clientDni: String(data.clientDni || '').trim(),
        clientPhone: String(data.clientPhone || '').trim(),
        clientPhoneAlt: String(data.clientPhoneAlt || '').trim(),
        clientEmail: String(data.clientEmail || '').trim().toLowerCase(),
        clientAddress: String(data.clientAddress || '').trim(),
      };

      console.log('🧹 Datos preparados:', cleanData);

      // Llamar al servicio
      const response = await casesService.createCase(cleanData);
      
      console.log('✅ Caso creado exitosamente');
      
      setSuccess(true);
      
      // Subir archivos si hay alguno
      if (selectedFiles.length > 0 && response?.id) {
        console.log(`📁 Subiendo ${selectedFiles.length} archivos...`);
        
        for (const file of selectedFiles) {
          try {
            await casesService.uploadFile(response.id, file);
            console.log(`✅ Archivo ${file.name} subido`);
          } catch (fileError) {
            console.warn(`⚠️ Error subiendo archivo ${file.name}`);
          }
        }
      }

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate({ to: '/cases' });
      }, 2000);

    } catch (error) {
      console.error('❌ Error:', error);
      
      let errorMessage = 'Error desconocido al crear el caso';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilesChange = (files: File[]) => {
    console.log('📁 Archivos seleccionados:', files.map(f => f.name));
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearError = () => {
    setSubmitError(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-300 w-full">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-slate-900">Nuevo caso</h1>
          <p className="text-sm text-slate-600 mt-1">Crea un nuevo caso legal</p>
        </div>
      </div>

      {/* Navegación */}
      <div className="px-6 py-4">
        <button
          type="button"
          onClick={() => navigate({ to: '/cases' })}
          disabled={isSubmitting}
          className="inline-flex items-center text-sm text-slate-700 hover:text-slate-900 transition disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Casos
        </button>
      </div>

      {/* Debug info solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="max-w-5xl mx-auto px-6 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-blue-700">
              <div><strong>Válido:</strong> {isValid ? '✅' : '❌'}</div>
              <div><strong>Errores:</strong> {Object.keys(errors).length}</div>
              <div><strong>Enviando:</strong> {isSubmitting ? '🔄' : '⏸️'}</div>
              <div><strong>Completo:</strong> {requiredFieldsCompleted ? '✅' : '❌'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Mensajes de estado */}
      {submitError && (
        <div className="max-w-5xl mx-auto px-6 mb-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error al crear el caso</h3>
                <div className="mt-2 text-sm text-red-700">{submitError}</div>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={clearError}
                    className="text-sm text-red-600 hover:text-red-500 underline"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="max-w-5xl mx-auto px-6 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">¡Caso creado exitosamente!</h3>
                <div className="mt-2 text-sm text-green-700">
                  Redirigiendo a la lista de casos...
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 max-w-5xl mx-auto text-slate-900">
        <BasicInfoCard register={register} errors={errors} />
        <ClientInfoCard register={register} errors={errors} />
        <NotesCard register={register} errors={errors} />
        <FileUploadCard 
          onFilesChange={handleFilesChange} 
          disabled={isSubmitting}
          files={selectedFiles}
          onRemoveFile={removeFile}
        />
        <ScheduleCard register={register} errors={errors} />
        
        {/* Botones de acción */}
        <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate({ to: '/cases' })}
            disabled={isSubmitting}
            className="px-6 py-2 border border-slate-400 text-slate-700 rounded-md hover:border-slate-600 hover:text-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting || !requiredFieldsCompleted || Object.keys(errors).length > 0}
            className="px-6 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {isSubmitting ? 'Guardando caso...' : 'Guardar caso'}
          </button>
        </div>
      </form>

      <Footer />
    </div>
  );
}