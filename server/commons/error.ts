export class MojangNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MojangNotFoundError';
    Error.captureStackTrace(this, this.constructor)
  }
}

// This is a custom error class for Zod validation errors
export class ZodValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ZodValidationError';
    Error.captureStackTrace(this, this.constructor)
  }
}

export class DatabaseReadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseReadError';
    Error.captureStackTrace(this, this.constructor)
  }
}

export class DatabaseEntryNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseEntryNotFoundError';
    Error.captureStackTrace(this, this.constructor)
  }
}