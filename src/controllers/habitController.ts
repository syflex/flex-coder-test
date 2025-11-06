/**
 * @file src/controllers/habitController.ts
 * @description Handles incoming HTTP requests for habit-related operations,
 *              delegates to the HabitService, and sends appropriate responses.
 */

import { Request, Response, NextFunction } from 'express';
import { HabitService } from '../services/HabitService';
import { createHabitSchema, updateHabitSchema, habitIdSchema } from '../schemas/habitSchema';
import { successResponse, ValidationError } from '../utils/apiResponse';

// Initialize HabitService instance. In a larger app, this would be dependency injected.
const habitService = new HabitService();

/**
 * Controller class for handling all habit-related API requests.
 */
export class HabitController {
    /**
     * Handles GET /api/habits requests. Retrieves all habits.
     */
    async getHabits(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const habits = await habitService.getAllHabits();
            successResponse(res, habits, 'Habits retrieved successfully.');
        } catch (error) {
            next(error); // Pass any error to the global error handler
        }
    }

    /**
     * Handles GET /api/habits/:id requests. Retrieves a single habit by ID.
     */
    async getHabitById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            // Validate habit ID format using Zod schema
            const parsedId = habitIdSchema.parse(id);
            const habit = await habitService.getHabitById(parsedId);
            successResponse(res, habit, 'Habit retrieved successfully.');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Handles POST /api/habits requests. Creates a new habit.
     */
    async createHabit(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate request body using Zod schema
            const { name, description } = createHabitSchema.parse(req.body);
            const newHabit = await habitService.createHabit(name, description);
            successResponse(res, newHabit, 'Habit created successfully.', 201); // 201 Created status
        } catch (error) {
            next(error);
        }
    }

    /**
     * Handles PUT /api/habits/:id requests. Updates an existing habit.
     * Note: This is for general updates (name, description), not completion status.
     */
    async updateHabit(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            // Validate habit ID format
            const parsedId = habitIdSchema.parse(id);
            // Validate request body for updates
            const updates = updateHabitSchema.parse(req.body);

            // The updateHabitSchema now validates for at least one field,
            // so this check becomes redundant, but kept for explicit clarity if schema changes.
            if (Object.keys(updates).length === 0) {
                throw new ValidationError('No valid update fields provided (name or description expected).');
            }

            const updatedHabit = await habitService.updateHabit(parsedId, updates);
            successResponse(res, updatedHabit, 'Habit updated successfully.');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Handles PATCH /api/habits/:id/complete requests. Marks a habit as complete.
     */
    async markHabitComplete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            // Validate habit ID format
            const parsedId = habitIdSchema.parse(id);
            const completedHabit = await habitService.markHabitComplete(parsedId);
            successResponse(res, completedHabit, 'Habit marked as complete successfully.');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Handles DELETE /api/habits/:id requests. Deletes a habit.
     */
    async deleteHabit(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            // Validate habit ID format
            const parsedId = habitIdSchema.parse(id);
            await habitService.deleteHabit(parsedId);
            successResponse(res, null, 'Habit deleted successfully.', 204); // 204 No Content status
        } catch (error) {
            next(error);
        }
    }
}
