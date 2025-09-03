import { config } from '@/constants/config';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const apiClient = axios.create({
  baseURL: config.BACKEND_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('access_token')
        : null;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isSignInPage =
        typeof window !== 'undefined' &&
        window.location.pathname === '/auth/signin';
      const isSignInRequest = error.config?.url?.includes('/auth/signin');

      if (!isSignInPage && !isSignInRequest) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/auth/signin';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const promise = apiClient({
    ...config,
    ...options,
  }).then(({ data }: AxiosResponse<T>) => data);

  return promise;
};

export default customInstance;
