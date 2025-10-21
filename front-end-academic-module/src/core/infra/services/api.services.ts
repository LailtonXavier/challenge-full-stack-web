import { tokenStore } from '../store/tokenStore';

interface BackendResponse<T> {
  data: T;
}

export interface FormattedError {
  status: number;
  message: string;
  code: number;
  raw: any;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || '';
  }

  async get<T>(endpoint: string): Promise<T> {
    const wrappedResponse = await this.request<T>(
      'GET', 
      endpoint
    ) as unknown as BackendResponse<T>;
    
    return wrappedResponse.data;
  }
  
  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const wrappedResponse = await this.request<T>(
      'POST', 
      endpoint, 
      body
    ) as unknown as BackendResponse<T>;
    
    return wrappedResponse.data;
  }

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    const wrappedResponse = await this.request<T>(
      'PUT', 
      endpoint, 
      body
    ) as unknown as BackendResponse<T>;
    
    return wrappedResponse.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request('DELETE', endpoint);
  }
  
  private async request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
  
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
  
    const accessToken = await tokenStore.getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
  
    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };
  
    try {
      const response = await fetch(url, options);
  
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
  
      const data = isJson ? await response.json() : await response.text();
  
      if (!response.ok) {
        const formattedError: FormattedError = {
          status: response.status,
          message: data?.message || response.statusText || 'Erro desconhecido',
          code: data?.code || 'UNKNOWN_ERROR',
          raw: data,
        };
        throw formattedError;
      }
  
      return data as T;
  
    } catch (error: any) {
      if (error.status) {
        throw error;
      } else {
        console.error('Erro de rede ou inesperado:', error);
        throw {
          status: 0,
          message: 'Falha na conexão com o servidor.',
          code: 'NETWORK_ERROR',
          raw: error,
        };
      }
    }
  }
  
}

export const api = new ApiService();