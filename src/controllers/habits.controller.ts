// src/controllers/habits.controller.ts
import { Request, Response, NextFunction } from 'express';
import { HabitsService } from '../services/habits.service';
import { HabitsRepository } from '../repositories/habits.repository';
import { CreateHabitDTO, UpdateHabitDTO, RecordCompletionDTO } from '../models/habit.model';

// In a real application, the userId would come from an authentication middleware (e.g., req.user.id).
// For this example, we'll use a mock user ID or extract it from query params for demo purposes.
const MOCK_USER_ID = 'anon-user-123'; // Default mock user ID

// Initialize repository and service
const habitsRepository = new HabitsRepository();
const habitsService = new HabitsService(habitsRepository);

/**
 * `HabitsController` handles incoming HTTP requests related to habits.
 * It parses request data, calls the appropriate service methods, and sends HTTP responses.
 */
export class HabitsController {
    /**
     * Creates a new habit.
     * POST /api/v1/habits
     */
    static async createHabit(req: Request, res: Response, next: NextFunction) {
        try {
            // `userId` from req.body is optional per schema. If not provided, use MOCK_USER_ID.
            // In a real app, `userId` would be `req.user.id` after authentication.
            const habitData: CreateHabitDTO = { ...req.body, userId: req.body.userId || MOCK_USER_ID };
            const newHabit = await habitsService.createHabit(habitData);
            res.status(201).json(newHabit);
        } catch (error) {
            next(error); // Pass error to global error handler
        }
    }

    /**
     * Retrieves all habits for a specific user.
     * GET /api/v1/habits
     */
    static async getAllHabits(req: Request, res: Response, next: NextFunction) {
        try {
            // `userId` from req.query is optional per schema. If not provided, use MOCK_USER_ID.
            const userId = req.query.userId as string || MOCK_USER_ID;
            const habits = await habitsService.getAllHabits(userId);
            res.status(200).json(habits);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Retrieves a single habit by its ID.
     * GET /api/v1/habits/:id
     */
    static async getHabitById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            // `userId` from req.query is optional per schema. If not provided, use MOCK_USER_ID.
            const userId = req.query.userId as string || MOCK_USER_ID;
            const habit = await habitsService.getHabitById(id, userId);
            res.status(200).json(habit);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Updates an existing habit by its ID.
     * PUT /api/v1/habits/:id
     */
    static async updateHabit(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updateData: UpdateHabitDTO = req.body;
            // `userId` from req.query is optional per schema. If not provided, use MOCK_USER_ID.
            const userId = req.query.userId as string || MOCK_USER_ID;
            const updatedHabit = await habitsService.updateHabit(id, userId, updateData);
            res.status(200).json(updatedHabit);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Deletes a habit by its ID.
     * DELETE /api/v1/habits/:id
     */
    static async deleteHabit(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            // `userId` from req.query is optional per schema. If not provided, use MOCK_USER_ID.
            const userId = req.query.userId as string || MOCK_USER_ID;
            await habitsService.deleteHabit(id, userId);
            res.status(204).send(); // No content for successful deletion
        } catch (error) {
            next(error);
        }
    }

    /**
     * Records a completion for a given habit.
     * POST /api/v1/habits/:id/complete
     */
    static async recordHabitCompletion(req: Request, res: Response, next: NextFunction) {
        try {
            const { id: habitId } = req.params;
            const completionData: RecordCompletionDTO = req.body;
            // `userId` from req.query is optional per schema. If not provided, use MOCK_USER_ID.
            const userId = req.query.userId as string || MOCK_USER_ID;
            const newCompletion = await habitsService.recordHabitCompletion(habitId, userId, completionData);
            res.status(201).json(newCompletion);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Retrieves all completion records for a specific habit.
     * GET /api/v1/habits/:id/completions
     */
    static async getHabitCompletions(req: Request, res: Response, next: NextFunction) {
        try {
            const { id: habitId } = req.params;
            // `userId` from req.query is optional per schema. If not provided, use MOCK_USER_ID.
            const userId = req.query.userId as string || MOCK_USER_ID;
            const completions = await habitsService.getHabitCompletions(habitId, userId);
            res.status(200).json(completions);
        } catch (error) {
            next(error);
        }
    }
}
