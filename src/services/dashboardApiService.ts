// services/dashboardApiService.ts
import { useState, useEffect, useCallback } from 'react';

// Importar tipos
import type { 
  DashboardMetrics, 
  DashboardCase, 
  DashboardInvoice, 
  UserProfile, 
  ApiResponse 
} from '~/types/dashboard';

// Nuevos tipos para agenda
export interface AgendaItem {
  id: number;
  event_name: string;
  description: string;
  due_date: string; // ISO string
  tags: string[];
}

export interface DashboardAgendaItem {
  id: number;
  time: string;
  title: string;
  location: string;
  type: 'audiencia' | 'consulta' | 'reunion';
}

// Obtener la URL base de la API desde variables de entorno
const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;

const getApiBaseUrl = (): string => {
  // Si existe la variable de entorno, usarla
  if (API_DOMAIN) {
    console.log(`🔗 API URL from env: ${API_DOMAIN}`);
    return API_DOMAIN;
  }
  
  // Fallback: usar un valor predeterminado
  console.log(`🔗 API URL (default fallback): http://localhost:8000`);
  return 'http://localhost:8000';
};

class DashboardApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getApiBaseUrl();
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.detail || `Error ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error de conexión',
      };
    }
  }

  async getDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
    return this.makeRequest<DashboardMetrics>('/dashboard/metrics');
  }

  async getRecentCases(limit: number = 5): Promise<ApiResponse<DashboardCase[]>> {
    const response = await this.makeRequest<{cases: DashboardCase[], total_count: number}>('/dashboard/recent-cases');
    
    if (response.success && response.data) {
      const recentCases = response.data.cases.slice(0, limit);
      return {
        success: true,
        data: recentCases
      };
    }
    
    return {
      success: false,
      error: response.error
    };
  }

  async getRecentInvoices(limit: number = 5): Promise<ApiResponse<DashboardInvoice[]>> {
    const response = await this.makeRequest<{invoices: DashboardInvoice[], total_count: number}>('/invoice/all');
    
    if (response.success && response.data) {
      const recentInvoices = response.data.invoices.slice(0, limit);
      return {
        success: true,
        data: recentInvoices
      };
    }
    
    return {
      success: false,
      error: response.error
    };
  }

  // Método para obtener la agenda completa (sin filtros de fecha)
// En tu dashboardApiService.ts, actualiza el método getTodayAgenda():

async getTodayAgenda(): Promise<ApiResponse<DashboardAgendaItem[]>> {
  const url = `/agenda/items/all`;
  const response = await this.makeRequest<AgendaItem[]>(url);
  
  if (response.success && response.data) {
    // Transformar los datos del backend al formato esperado por el frontend
    const dashboardItems: DashboardAgendaItem[] = response.data.map(item => {
      const date = new Date(item.due_date);
      
      // Verificar si la hora es 00:00 (medianoche)
      const isMiddnight = date.getHours() === 0 && date.getMinutes() === 0;
      
      let timeDisplay: string;
      if (isMiddnight) {
        // Si es medianoche, mostrar la fecha
        timeDisplay = date.toLocaleDateString('es-HN', { 
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      } else {
        // Si tiene hora específica, mostrar la hora
        timeDisplay = date.toLocaleTimeString('es-HN', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
      }
      
      // Determinar el tipo basado en tags o nombre del evento
      let type: 'audiencia' | 'consulta' | 'reunion' = 'reunion';
      if (item.tags?.includes('audiencia')) {
        type = 'audiencia';
      } else if (item.tags?.includes('consulta')) {
        type = 'consulta';
      } else if (item.event_name.toLowerCase().includes('audiencia')) {
        type = 'audiencia';
      } else if (item.event_name.toLowerCase().includes('consulta')) {
        type = 'consulta';
      }
      
      return {
        id: item.id,
        time: timeDisplay,  // ← Ahora mostrará fecha o hora según corresponda
        title: item.event_name,
        location: item.description || "No especificado",
        type: type
      };
    });
    
    return {
      success: true,
      data: dashboardItems
    };
  }
  
  return {
    success: false,
    error: response.error
  };
}
  async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    return this.makeRequest<UserProfile>('/user/profile');
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/docs`, {
        method: 'HEAD',
        credentials: 'include',
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const dashboardApiService = new DashboardApiService();

// Hooks existentes
export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const response = await dashboardApiService.getDashboardMetrics();
    
    if (response.success && response.data) {
      setMetrics(response.data);
    } else {
      setError(response.error || 'Error al cargar métricas');
      setMetrics(null);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics };
};

export const useRecentCases = (limit: number = 5) => {
  const [cases, setCases] = useState<DashboardCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const response = await dashboardApiService.getRecentCases(limit);
    
    if (response.success && response.data) {
      setCases(response.data);
    } else {
      setError(response.error || 'Error al cargar casos');
      setCases([]);
    }
    
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  return { cases, loading, error, refetch: fetchCases };
};

export const useRecentInvoices = (limit: number = 5) => {
  const [invoices, setInvoices] = useState<DashboardInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const response = await dashboardApiService.getRecentInvoices(limit);
    
    if (response.success && response.data) {
      setInvoices(response.data);
    } else {
      setError(response.error || 'Error al cargar facturas');
      setInvoices([]);
    }
    
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return { invoices, loading, error, refetch: fetchInvoices };
};

// Nuevo hook para agenda
export const useTodayAgenda = () => {
  const [agendaItems, setAgendaItems] = useState<DashboardAgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgenda = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const response = await dashboardApiService.getTodayAgenda();
    
    if (response.success && response.data) {
      setAgendaItems(response.data);
    } else {
      setError(response.error || 'Error al cargar agenda');
      setAgendaItems([]);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAgenda();
  }, [fetchAgenda]);

  return { agendaItems, loading, error, refetch: fetchAgenda };
};

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const response = await dashboardApiService.getUserProfile();
    
    if (response.success && response.data) {
      setProfile(response.data);
    } else {
      setError(response.error || 'Error al cargar perfil');
      setProfile(null);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
};

export const useBackendStatus = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkStatus = async () => {
      const isOnline = await dashboardApiService.healthCheck();
      setStatus(isOnline ? 'online' : 'offline');
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return status;
};