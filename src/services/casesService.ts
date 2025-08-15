const API_BASE = import.meta.env.VITE_API_DOMAIN || 'http://localhost:8000';

// Función helper para hacer requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include', // Importante para las cookies JWT
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}



// Servicio principal de casos
export const casesService = {
  // ===== OBTENER DATOS =====
  
  // Obtener todos los casos del usuario
  getAllCases: async () => {
    const response = await apiRequest('/legal/cases');
    
    // Tu backend devuelve un array directo, no un objeto con "cases"
    // Vamos a normalizar la respuesta
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
  },
  
  // Obtener un caso específico por ID
  getCaseById: async (caseId: number) => {
    return apiRequest(`/legal/get?case_id=${caseId}`);
  },
  
  // Obtener métricas de casos
  getCasesMetrics: async () => {
    return apiRequest('/legal/cases/metrics');
  },

  // ===== CREAR CASO =====
  
  // Crear nuevo caso
  createCase: async (caseData: {
    title: string;
    startDate: string;
    caseType: string;
    priority: string;
    description: string;
    notes?: string;
    // Cliente nuevo
    clientFirstName: string;
    clientLastName: string;
    clientDni: string;
    clientPhone: string;
    clientPhoneAlt?: string;
    clientEmail: string;
    clientAddress?: string;
  }) => {
    // Convertir datos del formulario al formato que espera el backend
    const backendData = {
      title: caseData.title,
      start_date: new Date(caseData.startDate).toISOString(),
      case_type: caseData.caseType,
      plaintiff: `${caseData.clientFirstName} ${caseData.clientLastName}`,
      defendant: 'Por definir', // Temporal
      description: caseData.description,
      notes: caseData.notes || '',
      client: {
        first_name: caseData.clientFirstName,
        last_name: caseData.clientLastName,
        phone_1: caseData.clientPhone,
        email: caseData.clientEmail,
        dni: caseData.clientDni,
        addresss: caseData.clientAddress || '', // Nota: hay un typo en tu backend "addresss"
      }
    };

    return apiRequest('/legal/new', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  },

  // ===== ACTUALIZAR CASO =====
  
  // Actualizar solo las notas de un caso
  updateCaseNotes: async (caseId: number, notes: string) => {
    return apiRequest('/legal/update/notes', {
      method: 'PUT',
      body: JSON.stringify({
        id: caseId,
        notes: notes,
      }),
    });
  },

  // Actualizar caso completo
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
    
    // Solo actualizar end_date si se proporciona (start_date no está en allowed_fields)
    if (updateData.end_date && updateData.end_date.trim() !== '') {
      // Convertir fecha solo si no está vacía
      backendData.end_date = new Date(updateData.end_date).toISOString();
    }

    // Solo enviar la petición si hay algo que actualizar
    if (Object.keys(backendData).length === 0) {
      return { message: 'No changes to update' };
    }

    return apiRequest(`/legal/cases/${caseId}`, {
      method: 'PUT',
      body: JSON.stringify(backendData),
    });
  },

  // ===== ARCHIVOS =====
  
  // Obtener archivos de un caso
  getCaseFiles: async (caseId: number) => {
    return apiRequest(`/legal/files/all?case_id=${caseId}`);
  },

  // Subir archivo a un caso
  uploadFile: async (caseId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/legal/upload?case_id=${caseId}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir archivo');
    }

    return response.json();
  },

  // ===== FUNCIONES HELPER =====
  
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
        address: backendCase.client.address || '',
      } : {
        id: 0,
        name: 'Cliente no asignado',
        dni: '',
        email: '',
        phone_1: '',
        phone_2: '',
        address: '',
      },
      account_id: 0,
      client_id: backendCase.client?.id || 0,
    };
  },

  // Convertir lista de casos del backend al formato frontend
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
        address: caseItem.client?.address || '',
      },
      account_id: 0,
      client_id: caseItem.client?.id || 0,
    }));
  }
};

// Servicio para dashboard
export const dashboardService = {
  // Obtener métricas del dashboard
  getMetrics: async () => {
    return apiRequest('/dashboard/metrics');
  },

  // Obtener casos recientes
  getRecentCases: async () => {
    return apiRequest('/dashboard/recent-cases');
  }
};

export default casesService;