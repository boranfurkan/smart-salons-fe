import type { ApiError } from '@/types/api';

/**
 * Extracts error message from API error object
 * @param error - The API error object
 * @param fallbackMessage - Fallback message if no specific error message is found
 * @returns Formatted error message
 */
export function getErrorMessage(
  error: ApiError,
  fallbackMessage: string
): string {
  return error.response?.data?.message || fallbackMessage;
}

/**
 * Checks if the error is a specific HTTP status code
 * @param error - The API error object
 * @param statusCode - The status code to check
 * @returns True if the error matches the status code
 */
export function isErrorStatus(error: ApiError, statusCode: number): boolean {
  return error.response?.status === statusCode;
}

/**
 * Checks if the error is a client error (4xx)
 * @param error - The API error object
 * @returns True if the error is a client error
 */
export function isClientError(error: ApiError): boolean {
  const status = error.response?.status;
  return status ? status >= 400 && status < 500 : false;
}

/**
 * Checks if the error is a server error (5xx)
 * @param error - The API error object
 * @returns True if the error is a server error
 */
export function isServerError(error: ApiError): boolean {
  const status = error.response?.status;
  return status ? status >= 500 : false;
}
