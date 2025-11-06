// src/utils/errors.ts
/**
 * Base custom error class for application-specific errors.
 * Provides a standardized structure for handling expected errors.
 */
export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean; // Indicates if the error is expected/handled

    constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        // Restore prototype chain
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

/**
 * Error specifically for when a requested resource is not found. (HTTP 404)
 */
export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

/**
 * Error specifically for validation failures. (HTTP 400)
 */
export class ValidationError extends AppError {
    constructor(message: string = 'Validation failed') {
        super(message, 400);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
