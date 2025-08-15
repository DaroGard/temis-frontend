import { CreateCaseData } from '~/types/cases';

const API_BASE = import.meta.env.VITE_API_DOMAIN || 'http://localhost:8000';

// Función helper para hacer requests 
async function apiRequest(endpoint: string, options: RequestInit = {}, debug = false) {
  if (debug) {
    console.log(`Making request to: ${API_BASE}${endpoint}`);
    console.log(`Request options:`, { method: options.method || 'GET', headers: options.headers });
  }
  
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (debug) {
      console.log(`Response status: ${response.status} ${response.statusText}`);
    }

    // Leer respuesta como texto primero
    const responseText = await response.text();
    if (debug) {
      console.log(`Raw response:`, responseText);
    }

    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('Error parseando JSON:', parseError);
      responseData = { raw: responseText };
    }

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      if (responseData.detail) {
        if (Array.isArray(responseData.detail)) {
          // Errores de validación de Pydantic
          const validationErrors = responseData.detail.map((err: any) => {
            const location = Array.isArray(err.loc) ? err.loc.join('.') : 'unknown';
            return `${location}: ${err.msg || 'error de validación'}`;
          }).join('\n');
          errorMessage = `Errores de validación:\n${validationErrors}`;
        } else {
          errorMessage = responseData.detail;
        }
      } else if (responseData.message) {
        errorMessage = responseData.message;
      }

      console.error('API Error:', errorMessage);
      throw new Error(errorMessage);
    }

    if (debug) {
      console.log('Request successful:', responseData);
    }
    return responseData;

  } catch (error) {
    if (debug) {
      console.error('Request failed:', error);
    }
    
    if (error instanceof TypeError) {
      throw new Error('Error de conexión. Verifica que el servidor esté funcionando en ' + API_BASE);
    }
    
    throw error;
  }
}

// Servicio completo compatible con TODO el sistema
export const casesService = {
  // ===== MÉTODOS PARA OBTENER CASOS (COMPATIBLES CON casesPage.tsx) =====
  
  // Obtener todos los casos del usuario - FUNCIONA CON TU casesPage.tsx
  getAllCases: async () => {
    try {
      const response = await apiRequest('/legal/cases');
      
      // Tu backend devuelve un array directo según tu casesPage.tsx
      if (Array.isArray(response)) {
        return {
          cases: response,
          total_count: response.length
        };
      } else if (response.cases && Array.isArray(response.cases)) {
        return response;
      } else {
        // Si es un solo caso, lo convertimos a array
        return {
          cases: [response],
          total_count: 1
        };
      }
    } catch (error) {
      console.error('Error en getAllCases:', error);
      throw error;
    }
  },
  
  // Obtener métricas de casos - FUNCIONA CON TU casesPage.tsx
  getCasesMetrics: async () => {
    try {
      return await apiRequest('/legal/cases/metrics');
    } catch (error) {
      console.error('Error en getCasesMetrics:', error);
      throw error;
    }
  },

  // Obtener un caso específico por ID
  getCaseById: async (caseId: number) => {
    try {
      return await apiRequest(`/legal/get?case_id=${caseId}`);
    } catch (error) {
      console.error(`Error obteniendo caso ${caseId}:`, error);
      throw error;
    }
  },

  // ===== MÉTODOS PARA ACTUALIZAR CASOS (COMPATIBLES CON CaseEditModal) =====
  
  // Actualizar caso completo - FUNCIONA CON TU handleSave en casesPage.tsx
  updateCase: async (caseId: number, updateData: {
    title?: string;
    case_type?: string;
    status?: string;
    priority_level?: string;
    description?: string;
    notes?: string;
    start_date?: string;
    end_date?: string;
  }) => {
    try {
      // Mapear valores del frontend a los valores que espera el backend
      const mapPriority = (priority: string) => {
        const priorityMap: Record<string, string> = {
          'alta': 'HIGH',
          'media': 'MID',
          'baja': 'NORMAL',
          'high': 'HIGH',
          'mid': 'MID', 
          'normal': 'NORMAL'
        };
        return priorityMap[priority.toLowerCase()] || priority.toUpperCase();
      };

      const mapStatus = (status: string) => {
        const statusMap: Record<string, string> = {
          'activo': 'ACTIVO',
          'victoria': 'VICTORIA',
          'derrota': 'DERROTA',
          'conciliacion': 'CONCILIACION'
        };
        return statusMap[status.toLowerCase()] || status.toUpperCase();
      };

      // Convertir datos del frontend al formato del backend
      const backendData: any = {};
      
      // Solo enviar campos que realmente cambiaron y están permitidos
      if (updateData.title) backendData.title = updateData.title;
      if (updateData.case_type) backendData.case_type = updateData.case_type.toUpperCase();
      if (updateData.status) backendData.status = mapStatus(updateData.status);
      if (updateData.priority_level) backendData.priority_level = mapPriority(updateData.priority_level);
      if (updateData.description) backendData.description = updateData.description;
      if (updateData.notes !== undefined) backendData.notes = updateData.notes; // Permitir notas vacías
      
      // Solo actualizar end_date si se proporciona
      if (updateData.end_date && updateData.end_date.trim() !== '') {
        backendData.end_date = new Date(updateData.end_date).toISOString();
      }

      // Solo enviar la petición si hay algo que actualizar
      if (Object.keys(backendData).length === 0) {
        return { message: 'No changes to update' };
      }

      return await apiRequest(`/legal/cases/${caseId}`, {
        method: 'PUT',
        body: JSON.stringify(backendData),
      });
    } catch (error) {
      console.error(`Error actualizando caso ${caseId}:`, error);
      throw error;
    }
  },

  // Actualizar solo las notas de un caso
  updateCaseNotes: async (caseId: number, notes: string) => {
    try {
      return await apiRequest('/legal/update/notes', {
        method: 'PUT',
        body: JSON.stringify({
          id: caseId,
          notes: notes,
        }),
      });
    } catch (error) {
      console.error(`Error actualizando notas del caso ${caseId}:`, error);
      throw error;
    }
  },

  // ===== MÉTODO PARA CREAR CASOS NUEVOS (PARA newCase.tsx) =====
  
  // Crear nuevo caso - ADAPTADO PARA TU BACKEND EXACTO
  createCase: async (caseData: CreateCaseData) => {
    console.log('createCase llamado con:', caseData);

    // Validaciones básicas
    if (!caseData.title?.trim()) throw new Error('El título es requerido');
    if (!caseData.startDate) throw new Error('La fecha es requerida');
    if (!caseData.clientFirstName?.trim()) throw new Error('El nombre del cliente es requerido');
    if (!caseData.clientEmail?.includes('@')) throw new Error('Email inválido');

    // Convertir fecha al formato ISO que espera tu backend
    let formattedDate: string;
    try {
      if (caseData.startDate.includes('T')) {
        formattedDate = new Date(caseData.startDate).toISOString();
      } else {
        formattedDate = new Date(caseData.startDate + 'T00:00:00.000Z').toISOString();
      }
      console.log(`Fecha convertida: ${caseData.startDate} → ${formattedDate}`);
    } catch (error) {
      console.error('❌ Error con fecha:', error);
      throw new Error('Formato de fecha inválido');
    }

    // Preparar datos del cliente según tu schema NewCaseData
    const clientData = {
      first_name: caseData.clientFirstName.trim(),
      last_name: caseData.clientLastName.trim(),
      phone_1: caseData.clientPhone.trim(),
      email: caseData.clientEmail.trim().toLowerCase(),
      dni: caseData.clientDni.trim(),
      address: caseData.clientAddress?.trim() || '',
    };

    console.log('Datos del cliente preparados:', clientData);

    // Preparar el payload según tu schema NewCaseData actualizado 
    const backendPayload = {
      title: caseData.title.trim(),
      start_date: formattedDate,
      case_type: mapCaseTypeToEnum(caseData.caseType), // CaseTypeEnum
      description: caseData.description.trim(),
      notes: caseData.notes?.trim() || '',
      client_id: 0, 
      client: clientData // Datos del cliente nuevo
    };

    // Función helper para mapear tipo de caso a enum 
    function mapCaseTypeToEnum(caseType: string): string {
      const caseTypeMap: Record<string, string> = {
        'civil': 'civil',
        'penal': 'penal', 
        'laboral': 'laboral',
        'familiar': 'familia' 
      };
      return caseTypeMap[caseType.toLowerCase()] || 'civil';
    }

    console.log('🚀 Payload final para tu backend:', JSON.stringify(backendPayload, null, 2));

    try {
      // Llamar a tu endpoint /legal/new con debugging habilitado
      const response = await apiRequest('/legal/new', {
        method: 'POST',
        body: JSON.stringify(backendPayload),
      }, true); // true = habilitar debugging

      console.log('Caso creado exitosamente:', response);
      return response;

    } catch (error) {
      console.error('Error creando caso:', error);
      
      // intepretacion de errores del backend
      if (error instanceof Error) {
        let message = error.message;
        
        if (message.includes('422')) {
          message = 'Datos no válidos. Revisa todos los campos.';
        } else if (message.includes('401')) {
          message = 'No estás autenticado. Inicia sesión nuevamente.';
        } else if (message.includes('400')) {
          message = 'No se pudo crear el caso. Verifica los datos.';
        }
        
        throw new Error(message);
      }
      
      throw error;
    }
  },

  // ===== MÉTODOS PARA ARCHIVOS =====
  
  // Obtener archivos de un caso
  getCaseFiles: async (caseId: number) => {
    try {
      return await apiRequest(`/legal/files/all?case_id=${caseId}`);
    } catch (error) {
      console.error(`Error obteniendo archivos del caso ${caseId}:`, error);
      throw error;
    }
  },

  // Subir archivo a un caso
  uploadFile: async (caseId: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE}/legal/upload?case_id=${caseId}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Error al subir archivo');
      }

      return response.json();
    } catch (error) {
      console.error(` Error subiendo archivo al caso ${caseId}:`, error);
      throw error;
    }
  },

  // ===== FUNCIONES HELPER PARA CONVERSIÓN DE DATOS =====
  
  // Convertir caso del backend al formato del frontend 
  convertBackendToFrontend: (backendCase: any) => {
    return {
      id: backendCase.id,
      title: backendCase.title || 'Sin título',
      case_number: backendCase.case_number || `CASE-${backendCase.id}`,
      case_type: backendCase.case_type || 'Sin tipo',
      start_date: backendCase.start_date ? backendCase.start_date.split('T')[0] : '', // Solo fecha
      end_date: backendCase.end_date ? backendCase.end_date.split('T')[0] : '',
      status: (backendCase.status || 'activo').toLowerCase(),
      priority_level: (backendCase.priority_level || 'media').toLowerCase(),
      description: backendCase.description || '',
      notes: backendCase.notes || '',
      client: backendCase.client ? {
        id: backendCase.client.id,
        name: `${backendCase.client.first_name || ''} ${backendCase.client.last_name || ''}`.trim(),
        dni: backendCase.client.dni || '',
        email: backendCase.client.email || '',
        phone_1: backendCase.client.phone_1 || '',
        phone_2: backendCase.client.phone_2 || '',
        address: backendCase.client.address || backendCase.client.addresss || '', // Maneja ambos formatos
      } : {
        id: 0,
        name: 'Cliente no asignado',
        dni: '', email: '', phone_1: '', phone_2: '', address: '',
      },
      account_id: 0,
      client_id: backendCase.client?.id || 0,
    };
  },

  // Convertir lista de casos del backend al formato frontend - USADO EN casesPage.tsx
  convertCasesSummary: (backendData: any) => {
    let casesArray = [];
    
    if (Array.isArray(backendData)) {
      casesArray = backendData;
    } else if (backendData.cases && Array.isArray(backendData.cases)) {
      casesArray = backendData.cases;
    } else if (backendData.id) {
      // Es un solo caso
      casesArray = [backendData];
    } else {
      console.warn('Estructura de datos no reconocida:', backendData);
      return [];
    }

    return casesArray.map((caseItem: any) => ({
      id: caseItem.id,
      title: caseItem.title || 'Sin título',
      case_number: caseItem.case_number || `CASE-${caseItem.id}`,
      case_type: caseItem.case_type || 'Sin tipo',
      start_date: caseItem.start_date ? caseItem.start_date.split('T')[0] : '',
      end_date: caseItem.end_date ? caseItem.end_date.split('T')[0] : '',
      status: (caseItem.status || 'activo').toLowerCase(),
      priority_level: 'media', // Temporal ya que no viene en summary
      description: caseItem.description || '',
      notes: caseItem.notes || '',
      client: {
        id: caseItem.client?.id || 0,
        name: caseItem.client_name || 
              (caseItem.client ? `${caseItem.client.first_name || ''} ${caseItem.client.last_name || ''}`.trim() : 'Cliente no asignado'),
        dni: caseItem.client?.dni || '',
        email: caseItem.client?.email || '',
        phone_1: caseItem.client?.phone_1 || '',
        phone_2: caseItem.client?.phone_2 || '',
        address: caseItem.client?.address || caseItem.client?.addresss || '', // Maneja ambos formatos
      },
      account_id: 0,
      client_id: caseItem.client?.id || 0,
    }));
  }
};

// Servicio de autenticación
export const authService = {
  login: async (username: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        body: formData, 
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }

      return response.json();
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }
  }
};

// Servicio para dashboard (si lo necesitas)
export const dashboardService = {
  getMetrics: async () => {
    try {
      return await apiRequest('/dashboard/metrics');
    } catch (error) {
      console.error('Error obteniendo métricas del dashboard:', error);
      throw error;
    }
  },

  getRecentCases: async () => {
    try {
      return await apiRequest('/dashboard/recent-cases');
    } catch (error) {
      console.error('Error obteniendo casos recientes:', error);
      throw error;
    }
  }
};

export default casesService;