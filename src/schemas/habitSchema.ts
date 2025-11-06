/**
 * @file src/schemas/habitSchema.ts
 * @description Defines Zod schemas for validating habit-related data.
 */

import { z } from 'zod';

/**
 * Zod schema for validating the input when creating a new habit.
 */
export const createHabitSchema = z.object({
    name: z.string()
        .min(1, { message: 'Habit name cannot be empty.' })
        .max(100, { message: 'Habit name too long (max 100 characters).' }),
    description: z.string()
        .max(500, { message: 'Description too long (max 500 characters).' })
        .optional()
        .transform(e => e === "" ? undefined : e), // Transform empty string to undefined
});

/**
 * Zod schema for validating the input when updating an existing habit.
 * All fields are optional, as it's a partial update.
 */
export const updateHabitSchema = z.object({
    name: z.string()
        .min(1, { message: 'Habit name cannot be empty.' })
        .max(100, { message: 'Habit name too long (max 100 characters).' })
        .optional()
        .transform(e => e === "" ? undefined : e),
    description: z.string()
        .max(500, { message: 'Description too long (max 500 characters).' })
        .optional()
        .transform(e => e === "" ? undefined : e),
    // 'completed' status change is handled by a dedicated endpoint,
    // so it's intentionally excluded from a generic 'update' for clarity and business logic separation.
    // If it were allowed here, additional validation would be needed to ensure `completedAt` is set/unset correctly.
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field (name or description) must be provided for update.",
    path: ["body"],
});

/**
 * Zod schema for validating a habit ID (expects a UUID format).
 */
export const habitIdSchema = z.string().uuid({ message: 'Invalid habit ID format. Must be a UUID.' });
