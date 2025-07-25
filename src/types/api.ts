/**
 * API Error types for consistent error handling across the application
 */

// Backend error response structure (from NestJS)
export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode: number;
}

// Axios error structure with our API error response
export interface ApiError {
  response?: {
    data: ApiErrorResponse;
    status: number;
    statusText: string;
  };
  message: string;
  name: string;
}

// Success response types for mutations
export interface AuthSuccessResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
    role?: 'ADMIN' | 'USER';
  };
}

// Generic success response with message
export interface MessageSuccessResponse {
  message: string;
}

// React Query retry function type
export interface QueryRetryContext {
  failureCount: number;
  error: ApiError;
}
