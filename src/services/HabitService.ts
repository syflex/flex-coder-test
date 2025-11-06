/**
 * @file src/services/HabitService.ts
 * @description Provides business logic and orchestrates data operations for Habits.
 */

import { Habit } from '../models/Habit';
import { HabitRepository } from '../repositories/HabitRepository';
import { NotFoundError, BadRequestError } from '../utils/apiResponse';

/**
 * Service class for handling all habit-related business logic.
 * It interacts with the HabitRepository to perform data operations.
 */
export class HabitService {
    private habitRepository: HabitRepository;

    constructor() {
        // Initialize the repository. In a real application, this might be dependency injected.
        this.habitRepository = new HabitRepository();
    }

    /**
     * Retrieves all habits.
     * @returns A promise that resolves to an array of Habit objects.
     */
    async getAllHabits(): Promise<Habit[]> {
        return this.habitRepository.findAll();
    }

    /**
     * Retrieves a single habit by its ID.
     * @param id The ID of the habit to retrieve.
     * @returns A promise that resolves to the Habit object.
     * @throws NotFoundError if the habit with the given ID does not exist.
     */
    async getHabitById(id: string): Promise<Habit> {
        const habit = await this.habitRepository.findById(id);
        if (!habit) {
            throw new NotFoundError(`Habit with ID "${id}" not found.`);
        }
        return habit;
    }

    /**
     * Creates a new habit.
     * @param name The name of the habit.
     * @param description An optional description for the habit.
     * @returns A promise that resolves to the newly created Habit object.
     */
    async createHabit(name: string, description?: string): Promise<Habit> {
        return this.habitRepository.create({ name, description });
    }

    /**
     * Updates an existing habit.
     * This method is intended for general updates like name or description.
     * Completion status changes should use `markHabitComplete`.
     * @param id The ID of the habit to update.
     * @param updates The partial data to update (e.g., name, description).
     * @returns A promise that resolves to the updated Habit object.
     * @throws NotFoundError if the habit is not found.
     * @throws BadRequestError if an attempt is made to update the 'completed' status directly.
     */
    async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
        const existingHabit = await this.habitRepository.findById(id);
        if (!existingHabit) {
            throw new NotFoundError(`Habit with ID "${id}" not found.`);
        }

        // Prevent updating 'completed' status via this generic update method.
        // It should be handled by the dedicated 'markHabitComplete' method.
        if (updates.completed !== undefined) {
            throw new BadRequestError('Updating habit completion status is not allowed via this endpoint. Use the dedicated mark complete endpoint.');
        }

        const updatedHabit = await this.habitRepository.update(id, updates);
        if (!updatedHabit) {
            // This case should ideally not be reached if findById succeeded
            throw new Error('Failed to update habit after validation.');
        }
        return updatedHabit;
    }

    /**
     * Marks a habit as complete.
     * @param id The ID of the habit to mark complete.
     * @returns A promise that resolves to the updated Habit object.
     * @throws NotFoundError if the habit is not found.
     * @throws BadRequestError if the habit is already completed.
     */
    async markHabitComplete(id: string): Promise<Habit> {
        const habit = await this.habitRepository.findById(id);
        if (!habit) {
            throw new NotFoundError(`Habit with ID "${id}" not found.`);
        }
        if (habit.completed) {
            throw new BadRequestError('Habit is already marked as complete.');
        }

        const updatedHabit = await this.habitRepository.update(id, {
            completed: true,
            completedAt: new Date(),
        });

        if (!updatedHabit) {
            // This case should ideally not be reached if findById succeeded
            throw new Error('Failed to mark habit complete.');
        }
        return updatedHabit;
    }

    /**
     * Deletes a habit.
     * @param id The ID of the habit to delete.
     * @returns A promise that resolves to true if the habit was deleted.
     * @throws NotFoundError if the habit is not found.
     */
    async deleteHabit(id: string): Promise<boolean> {
        const habitExists = await this.habitRepository.findById(id);
        if (!habitExists) {
            throw new NotFoundError(`Habit with ID "${id}" not found.`);
        }
        return this.habitRepository.delete(id);
    }
}
