import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { casesService } from '~/services/casesService';

interface CreateCaseData {
  title: string;
  startDate: string;
  caseType: string;
  priority: string;
  description: string;
  notes?: string;
  clientFirstName: string;
  clientLastName: string;
  clientDni: string;
  clientPhone: string;
  clientPhoneAlt?: string;
  clientEmail: string;
  clientAddress?: string;
}

interface CreateCaseState {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

export function useCreateCase() {
  const navigate = useNavigate();
  const [state, setState] = useState<CreateCaseState>({
    isSubmitting: false,
    error: null,
    success: false,
  });

  const createCase = async (data: CreateCaseData, files?: File[]) => {
    setState(prev => ({
      ...prev,
      isSubmitting: true,
      error: null,
      success: false,
    }));

    try {
      console.log('🚀 Iniciando creación de caso...');
      console.log('Datos del formulario:', data);

      // Crear el caso
      const response = await casesService.createCase(data);
      console.log('✅ Caso creado exitosamente:', response);

      // Si hay archivos, subirlos después de crear el caso
      if (files && files.length > 0 && response.id) {
        console.log(`📁 Subiendo ${files.length} archivos...`);
        
        const uploadPromises = files.map(async (file, index) => {
          try {
            console.log(`📄 Subiendo archivo ${index + 1}/${files.length}: ${file.name}`);
            const uploadResponse = await casesService.uploadFile(response.id, file);
            console.log(`✅ Archivo ${file.name} subido exitosamente`);
            return uploadResponse;
          } catch (error) {
            console.error(`❌ Error subiendo archivo ${file.name}:`, error);
            // No fallar todo el proceso por un archivo
            return null;
          }
        });

        const uploadResults = await Promise.all(uploadPromises);
        const successfulUploads = uploadResults.filter(result => result !== null);
        
        console.log(`📊 Archivos subidos: ${successfulUploads.length}/${files.length}`);
        
        if (successfulUploads.length < files.length) {
          console.warn('⚠️ Algunos archivos no se pudieron subir');
        }
      }

      setState(prev => ({
        ...prev,
        isSubmitting: false,
        success: true,
      }));

      // Mostrar mensaje de éxito y redirigir después de un breve delay
      setTimeout(() => {
        navigate({ 
          to: '/cases',
          // Puedes pasar el ID del caso creado si quieres mostrar un mensaje específico
          search: { created: response.id }
        });
      }, 1000);

      return response;

    } catch (error) {
      console.error('❌ Error creando caso:', error);
      
      let errorMessage = 'Error desconocido al crear el caso';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: errorMessage,
      }));

      throw error;
    }
  };

  const clearError = () => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  };

  const reset = () => {
    setState({
      isSubmitting: false,
      error: null,
      success: false,
    });
  };

  return {
    createCase,
    clearError,
    reset,
    ...state,
  };
}