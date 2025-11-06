// src/repositories/habits.repository.ts
import { getDb } from '../database';
import { Habit, HabitCompletion, CreateHabitDTO, UpdateHabitDTO, RecordCompletionDTO } from '../models/habit.model';
import { NotFoundError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

/**
 * `HabitsRepository` handles all direct database interactions for habits and their completions.
 * It abstracts the data storage mechanism (in this case, an in-memory mock database).
 * In a real application, this would interact with an ORM like Prisma, TypeORM, or a direct SQL client.
 */
export class HabitsRepository {
    private db = getDb(); // Access the in-memory mock database

    /**
     * Creates a new habit in the database.
     * @param habitData - Data for the new habit.
     * @returns The newly created habit with its ID and timestamps.
     */
    async createHabit(habitData: CreateHabitDTO): Promise<Habit> {
        const newHabit: Habit = {
            id: uuidv4(), // Generate a unique ID
            ...habitData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.db.habits.push(newHabit);
        return newHabit;
    }

    /**
     * Retrieves all habits belonging to a specific user.
     * @param userId - The ID of the user whose habits are to be retrieved.
     * @returns An array of habits.
     */
    async findAllHabits(userId: string): Promise<Habit[]> {
        return this.db.habits.filter(h => h.userId === userId);
    }

    /**
     * Retrieves a single habit by its ID, ensuring it belongs to the specified user.
     * @param id - The ID of the habit to retrieve.
     * @param userId - The ID of the user who owns the habit.
     * @returns The found habit.
     * @throws {NotFoundError} If the habit is not found or does not belong to the user.
     */
    async findHabitById(id: string, userId: string): Promise<Habit> {
        const habit = this.db.habits.find(h => h.id === id && h.userId === userId);
        if (!habit) {
            throw new NotFoundError(`Habit with ID '${id}' not found or not accessible by user '${userId}'.`);
        }
        return habit;
    }

    /**
     * Updates an existing habit.
     * @param id - The ID of the habit to update.
     * @param userId - The ID of the user who owns the habit.
     * @param updateData - The data to update the habit with.
     * @returns The updated habit.
     * @throws {NotFoundError} If the habit is not found or does not belong to the user.
     */
    async updateHabit(id: string, userId: string, updateData: UpdateHabitDTO): Promise<Habit> {
        const habitIndex = this.db.habits.findIndex(h => h.id === id && h.userId === userId);
        if (habitIndex === -1) {
            throw new NotFoundError(`Habit with ID '${id}' not found or not accessible by user '${userId}'.`);
        }
        const existingHabit = this.db.habits[habitIndex];
        const updatedHabit: Habit = {
            ...existingHabit,
            ...updateData,
            updatedAt: new Date(), // Update timestamp
        };
        this.db.habits[habitIndex] = updatedHabit;
        return updatedHabit;
    }

    /**
     * Deletes a habit and all its associated completions.
     * @param id - The ID of the habit to delete.
     * @param userId - The ID of the user who owns the habit.
     * @throws {NotFoundError} If the habit is not found or does not belong to the user.
     */
    async deleteHabit(id: string, userId: string): Promise<void> {
        const initialLength = this.db.habits.length;
        // Filter out the habit
        this.db.habits = this.db.habits.filter(h => !(h.id === id && h.userId === userId));

        if (this.db.habits.length === initialLength) {
            throw new NotFoundError(`Habit with ID '${id}' not found or not accessible by user '${userId}'.`);
        }

        // Also delete associated completions for this habit
        this.db.habitCompletions = this.db.habitCompletions.filter(c => c.habitId !== id);
    }

    /**
     * Records a completion for a specific habit.
     * @param habitId - The ID of the habit to record completion for.
     * @param userId - The ID of the user who owns the habit.
     * @param completionData - Optional data for the completion (e.g., notes, specific date).
     * @returns The newly created habit completion record.
     * @throws {NotFoundError} If the habit is not found or does not belong to the user.
     */
    async recordHabitCompletion(habitId: string, userId: string, completionData: RecordCompletionDTO): Promise<HabitCompletion> {
        // First, ensure the habit exists and belongs to the user
        const habit = this.db.habits.find(h => h.id === habitId && h.userId === userId);
        if (!habit) {
            throw new NotFoundError(`Habit with ID '${habitId}' not found or not accessible by user '${userId}'.`);
        }

        const newCompletion: HabitCompletion = {
            id: uuidv4(), // Generate a unique ID
            habitId: habitId,
            completionDate: completionData.completionDate || new Date(), // Default to current date if not provided
            notes: completionData.notes,
            createdAt: new Date(),
        };
        this.db.habitCompletions.push(newCompletion);
        return newCompletion;
    }

    /**
     * Retrieves all completion records for a specific habit.
     * @param habitId - The ID of the habit.
     * @param userId - The ID of the user who owns the habit.
     * @returns An array of habit completion records.
     * @throws {NotFoundError} If the habit is not found or does not belong to the user.
     */
    async findHabitCompletions(habitId: string, userId: string): Promise<HabitCompletion[]> {
        // Ensure the habit exists and belongs to the user before fetching completions
        const habit = this.db.habits.find(h => h.id === habitId && h.userId === userId);
        if (!habit) {
            throw new NotFoundError(`Habit with ID '${habitId}' not found or not accessible by user '${userId}'.`);
        }
        return this.db.habitCompletions.filter(c => c.habitId === habitId);
    }
}
