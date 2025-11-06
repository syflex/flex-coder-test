/**
 * @file src/utils/apiResponse.ts
 * @description Provides standardized utility functions and custom error classes
 *              for consistent API response formatting in Express applications.
 */

import { Response } from 'express';

/**
 * Interface for a generic API response structure.
 * This ensures consistency in how success and error messages are returned.
 */
interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    // statusCode is implicitly handled by res.status() and not typically part of the body
}

/**
 * Sends a standardized successful API response.
 * @param res The Express response object.
 * @param data The primary data payload to be returned.
 * @param message An optional, human-readable success message.
 * @param statusCode The HTTP status code to send (defaults to 200 OK).
 * @returns The Express response object after sending the JSON.
 */
export const successResponse = <T>(
    res: Response,
    data: T | null, // Allow null for 204 No Content responses
    message: string = 'Operation successful.',
    statusCode: number = 200
): Response => {
    const response: ApiResponse<T> = {
        success: true,
        message,
        data: data !== null ? data : undefined, // Omit data if null for 204
    };
    return res.status(statusCode).json(response);
};

/**
 * Sends a standardized error API response.
 * @param res The Express response object.
 * @param error The error message or an Error object.
 * @param statusCode The HTTP status code to send (defaults to 500 Internal Server Error).
 * @returns The Express response object after sending the JSON.
 */
export const errorResponse = (
    res: Response,
    error: string | Error,
    statusCode: number = 500
): Response => {
    // Extract the message from an Error object, or use the string directly
    const errorMessage = typeof error === 'string' ? error : error.message;
    const response: ApiResponse<any> = {
        success: false,
        error: errorMessage,
    };
    return res.status(statusCode).json(response);
};

/**
 * Custom error class for resources not found (HTTP 404).
 */
export class NotFoundError extends Error {
    constructor(message: string = 'Resource not found.') {
        super(message);
        this.name = 'NotFoundError';
    }
}

/**
 * Custom error class for bad client requests (HTTP 400).
 * Useful for business logic violations beyond schema validation.
 */
export class BadRequestError extends Error {
    constructor(message: string = 'Bad request.') {
        super(message);
        this.name = 'BadRequestError';
    }
}

/**
 * Custom error class for validation failures (HTTP 400).
 * Can be used for custom validation outside of schemas or as a generic validation error.
 */
export class ValidationError extends Error {
    constructor(message: string = 'Validation failed.') {
        super(message);
        this.name = 'ValidationError';
    }
}
