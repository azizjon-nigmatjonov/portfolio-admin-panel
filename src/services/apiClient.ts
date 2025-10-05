import { tokenService } from './tokenService';

/**
 * API Client with automatic Firebase token injection
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || import.meta.env.VITE_BASE_URL || '/api';
  }

  /**
   * Get headers with Firebase token
   */
  private async getHeaders(customHeaders: HeadersInit = {}): Promise<HeadersInit> {
    const authHeader = await tokenService.getAuthHeader();
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...authHeader,
    };

    return {
      ...defaultHeaders,
      ...customHeaders,
    };
  }

  /**
   * Make authenticated GET request
   */
  async get<T>(endpoint: string, customHeaders?: HeadersInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getHeaders(customHeaders);

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Make authenticated POST request
   */
  async post<T>(endpoint: string, data?: any, customHeaders?: HeadersInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getHeaders(customHeaders);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Make authenticated PUT request
   */
  async put<T>(endpoint: string, data?: any, customHeaders?: HeadersInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getHeaders(customHeaders);

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Make authenticated PATCH request
   */
  async patch<T>(endpoint: string, data?: any, customHeaders?: HeadersInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getHeaders(customHeaders);

    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Make authenticated DELETE request
   */
  async delete<T>(endpoint: string, customHeaders?: HeadersInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getHeaders(customHeaders);

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Upload file with Firebase token
   */
  async uploadFile<T>(endpoint: string, file: File, customHeaders?: HeadersInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const authHeader = await tokenService.getAuthHeader();
    
    const formData = new FormData();
    formData.append('file', file);

    const headers = {
      ...authHeader,
      ...customHeaders,
    };

    // Remove Content-Type for FormData (browser will set it automatically)
    delete (headers as any)['Content-Type'];

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export convenience functions
export const apiGet = <T>(endpoint: string, headers?: HeadersInit) => apiClient.get<T>(endpoint, headers);
export const apiPost = <T>(endpoint: string, data?: any, headers?: HeadersInit) => apiClient.post<T>(endpoint, data, headers);
export const apiPut = <T>(endpoint: string, data?: any, headers?: HeadersInit) => apiClient.put<T>(endpoint, data, headers);
export const apiPatch = <T>(endpoint: string, data?: any, headers?: HeadersInit) => apiClient.patch<T>(endpoint, data, headers);
export const apiDelete = <T>(endpoint: string, headers?: HeadersInit) => apiClient.delete<T>(endpoint, headers);
export const apiUploadFile = <T>(endpoint: string, file: File, headers?: HeadersInit) => apiClient.uploadFile<T>(endpoint, file, headers);

