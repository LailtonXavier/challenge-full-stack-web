export enum ErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  NOT_FOUND = 'NOT_FOUND',
  INVALID_ID = 'INVALID_ID',
  INVALID = 'INVALID',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
}

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: ErrorCode,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }

  toObject() {
    return {
      message: this.message,
      code: this.code,
    };
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message = 'Invalid credentials') {
    super(message, ErrorCode.INVALID_CREDENTIALS, 401);
  }
}

export class EmailAlreadyExistsError extends AppError {
  constructor(email: string) {
    super(
      `Email ${email} already registered`,
      ErrorCode.EMAIL_ALREADY_EXISTS,
      409
    );
  }
}

export class AlreadyExistsError extends AppError {
  constructor(data: string) {
    super(
      `${data} already registered`,
      ErrorCode.EMAIL_ALREADY_EXISTS,
      409
    );
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with id ${identifier} not found`
      : `${resource} not found`;
    super(message, ErrorCode.NOT_FOUND, 404);
  }
}

export class InvalidIdError extends AppError {
  constructor(message = 'Invalid resource ID') {
    super(message, ErrorCode.INVALID_ID, 400);
  }
}

export class InvalidIdSame extends AppError {
  constructor(message: string) {
    super(message, ErrorCode.INVALID_ID, 400);
  }
}

export class WeakPasswordError extends AppError {
  constructor(message: string) {
    super(message, ErrorCode.WEAK_PASSWORD, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, ErrorCode.UNAUTHORIZED, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, ErrorCode.FORBIDDEN, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, ErrorCode.CONFLICT, 409);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, ErrorCode.BAD_REQUEST, 400);
  }
}

export class FailedValidationError extends AppError {
  constructor(message: string) {
    super(message, ErrorCode.VALIDATION_ERROR, 400);
  }
}

export class ValidationError extends AppError {
  constructor(
    public readonly issues: Array<{
      field: string;
      message: string;
    }>
  ) {
    super('Validation failed', ErrorCode.VALIDATION_ERROR, 400);
  }

  toObject() {
    return {
      message: this.message,
      code: this.code,
      errors: this.issues,
    };
  }
}