// src/schemas/habit.schema.ts
import { z } from 'zod';

// --- Individual Schemas for Request Body/Params/Query ---

/**
 * Zod schema for validating the request body when creating a new habit.
 */
export const createHabitBodySchema = z.object({
    name: z.string({
        required_error: 'Habit name is required.',
        invalid_type_error: 'Habit name must be a string.',
    }).trim().min(1, 'Habit name cannot be empty.'),
    description: z.string().trim().optional(),
    // For this demo, userId can be optionally provided in the body or defaulted in the controller.
    // In a real application, `userId` would be extracted securely from an authentication token
    // and would not be part of the request body for creating a habit.
    userId: z.string().uuid('Invalid user ID format.').optional(),
});

/**
 * Zod schema for validating the request body when updating an existing habit.
 * All fields are optional to allow partial updates.
 */
export const updateHabitBodySchema = z.object({
    name: z.string().trim().min(1, 'Habit name cannot be empty.').optional(),
    description: z.string().trim().optional(),
}).partial(); // Allows all fields to be optional for partial updates

/**
 * Zod schema for validating the request body when recording a habit completion.
 */
export const recordCompletionBodySchema = z.object({
    // `completionDate` is optional; if not provided, the controller will use current date.
    // It expects an ISO 8601 string and transforms it into a Date object.
    completionDate: z.string().datetime({ message: 'Invalid date format, expected ISO 8601 string.' }).optional().transform((val) => val ? new Date(val) : new Date()),
    notes: z.string().trim().optional(),
});

/**
 * Zod schema for validating the `id` parameter in the URL (e.g., /habits/:id).
 */
export const habitParamsSchema = z.object({
    id: z.string().uuid('Invalid habit ID format. A UUID is required.'),
});

/**
 * Zod schema for validating query parameters when getting all habits.
 * In this demo, `userId` is expected as a query parameter for filtering.
 * In a real app, `userId` would come from an authenticated session.
 */
export const getAllHabitsQuerySchema = z.object({
    userId: z.string().uuid('Invalid user ID format in query.').optional(),
});


// --- Combined Schemas for `validate` Middleware ---
// These combine individual schemas to validate the full request object (body, params, query).

export const createHabitRequestSchema = z.object({
    body: createHabitBodySchema,
});

export const getHabitByIdRequestSchema = z.object({
    params: habitParamsSchema,
});

export const updateHabitRequestSchema = z.object({
    params: habitParamsSchema,
    body: updateHabitBodySchema,
});

export const deleteHabitRequestSchema = z.object({
    params: habitParamsSchema,
});

export const recordCompletionRequestSchema = z.object({
    params: habitParamsSchema,
    body: recordCompletionBodySchema,
});

export const getHabitCompletionsRequestSchema = z.object({
    params: habitParamsSchema,
});

export const getAllHabitsRequestSchema = z.object({
    query: getAllHabitsQuerySchema,
});
