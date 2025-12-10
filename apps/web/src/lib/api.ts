import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { ApiResponse } from '@monorepo/shared';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        // 添加认证token
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token过期，清除本地存储并跳转到登录页
          this.clearAuthToken();
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  private clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  public setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  public setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', token);
    }
  }

  public get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.client.get(url, { params }).then(res => res.data);
  }

  public post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.post(url, data).then(res => res.data);
  }

  public put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.put(url, data).then(res => res.data);
  }

  public patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.patch(url, data).then(res => res.data);
  }

  public delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.client.delete(url).then(res => res.data);
  }
}

export const apiClient = new ApiClient();