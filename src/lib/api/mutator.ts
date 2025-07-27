import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if we're already on the sign-in page or it's a sign-in request
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

// Custom instance for orval
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
