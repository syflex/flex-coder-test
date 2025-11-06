// src/middlewares/errorHandler.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

/**
 * Global error handling middleware for Express applications.
 * This should be the last middleware added to the Express app.
 * It catches errors thrown by route handlers and other middleware,
 * and sends a standardized error response to the client.
 *
 * @param err - The error object.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next middleware function.
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    // Check if the error is an instance of a custom `AppError` (or its subclasses).
    // These are operational errors that we expect and handle gracefully.
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            // Optionally, include more details if in development mode
            // details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        });
    }

    // For any other unhandled or unexpected errors (programming errors),
    // log them and send a generic 500 server error response.
    // These are critical errors that indicate a bug and should be fixed.
    console.error('UNHANDLED ERROR:', err);

    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!', // Generic message for client
        // details: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Include stack in dev
    });
};
