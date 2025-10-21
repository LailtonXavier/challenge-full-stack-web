import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/shared/errors/app-error';

export function errorHandlerMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {

  if (error instanceof AppError) {
    res.status(error.statusCode || 500).json(error.toObject());
    return;
  }

  res.status(500).json({
    message: 'Internal server error',
    code: 'INTERNAL_ERROR',
    details:
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'Something went wrong',
  });
}