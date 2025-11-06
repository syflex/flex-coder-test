/**
 * @file src/middlewares/errorHandler.ts
 * @description Global error handling middleware for Express.
 *              Catches various types of errors and sends standardized error API responses.
 */

import { Request, Response, NextFunction } from 'express';
import { errorResponse, NotFoundError, BadRequestError, ValidationError } from '../utils/apiResponse';
import { ZodError } from 'zod'; // Import ZodError for specific validation handling

/**
 * Global error handling middleware for the Express application.
 * This middleware should be registered as the last middleware in the Express chain.
 *
 * It catches errors, determines the appropriate HTTP status code and message,
 * and sends a standardized JSON error response to the client.
 *
 * @param err The error object caught by Express.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The Express next middleware function.
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // If headers have already been sent, delegate to the default Express error handler
    // to prevent crashes from trying to send another response.
    if (res.headersSent) {
        return next(err);
    }

    let statusCode = 500; // Default to Internal Server Error
    let errorMessage = 'An unexpected server error occurred.';

    // Custom error handling based on the error instance
    if (err instanceof NotFoundError) {
        statusCode = 404; // Not Found
        errorMessage = err.message;
    } else if (err instanceof BadRequestError || err instanceof ValidationError) {
        statusCode = 400; // Bad Request
        errorMessage = err.message;
    } else if (err instanceof ZodError) {
        // Handle Zod validation errors specifically
        statusCode = 400; // Bad Request
        // Zod errors contain an array of issues, you can format them as needed
        errorMessage = `Validation failed: ${err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')}`;
    } else {
        // For any other unexpected errors, log them for debugging
        console.error('Unhandled server error:', err);
        // In production, you might want a more generic message for 500 errors
        // to avoid leaking sensitive internal details.
        // errorMessage = 'An unexpected server error occurred. Please try again later.';
    }

    // Send the standardized error response
    errorResponse(res, errorMessage, statusCode);
};
