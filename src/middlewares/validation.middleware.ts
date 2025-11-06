// src/middlewares/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

/**
 * Middleware for validating incoming request data (body, query, params) against a Zod schema.
 * The schema should be structured to match the `req` object parts, e.g.,
 * `z.object({ body: someBodySchema, params: someParamsSchema })`.
 *
 * @param schema - The Zod schema to validate the request against.
 * @returns An Express middleware function.
 */
export const validate = (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Parse the request object against the provided Zod schema.
            // This allows schemas to validate `req.body`, `req.query`, and `req.params` simultaneously.
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error: any) {
            // If validation fails, catch the ZodError and transform it into a custom ValidationError.
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: any) => ({
                    field: issue.path.join('.'), // Path to the invalid field (e.g., 'body.name')
                    message: issue.message,       // Zod's error message
                    code: issue.code,             // Zod's error code (e.g., 'invalid_type', 'too_small')
                }));
                // Pass the ValidationError to the global error handler
                next(new ValidationError(`Validation failed: ${JSON.stringify(errorMessages)}`));
            } else {
                // For any other unexpected errors during validation, pass them along.
                next(error);
            }
        }
    };
