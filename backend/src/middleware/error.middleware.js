import { ApiError } from '../utils/errors.js';

export function errorHandler(err, req, res, next) {
  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  if (statusCode === 500) {
    console.error('Unhandled Server Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: err.name || 'Error',
      ...(err.details ? { details: err.details } : {})
    }
  });
}
