// src/services/habits.service.ts
import { HabitsRepository } from '../repositories/habits.repository';
import { Habit, HabitCompletion, CreateHabitDTO, UpdateHabitDTO, RecordCompletionDTO } from '../models/habit.model';
// NotFoundError is already handled by the repository and propagated

/**
 * `HabitsService` contains the business logic related to habits and their completions.
 * It interacts with the `HabitsRepository` to perform data operations.
 * This layer can include additional business rules, validations, or orchestrations.
 */
export class HabitsService {
    constructor(private habitsRepository: HabitsRepository) {}

    /**
     * Creates a new habit.
     * @param habitData - The data for the new habit.
     * @returns The created habit.
     */
    async createHabit(habitData: CreateHabitDTO): Promise<Habit> {
        // Additional business logic could go here, e.g.,
        // - Check for existing habit with the same name for this user
        // - Apply default values or transformations
        return this.habitsRepository.createHabit(habitData);
    }

    /**
     * Retrieves all habits for a given user.
     * @param userId - The ID of the user.
     * @returns An array of habits.
     */
    async getAllHabits(userId: string): Promise<Habit[]> {
        return this.habitsRepository.findAllHabits(userId);
    }

    /**
     * Retrieves a single habit by its ID for a given user.
     * @param id - The ID of the habit.
     * @param userId - The ID of the user.
     * @returns The habit.
     * @throws {NotFoundError} If the habit is not found or not accessible.
     */
    async getHabitById(id: string, userId: string): Promise<Habit> {
        // The repository handles the NotFoundError, no need for redundant check here.
        return this.habitsRepository.findHabitById(id, userId);
    }

    /**
     * Updates an existing habit for a given user.
     * @param id - The ID of the habit to update.
     * @param userId - The ID of the user.
     * @param updateData - The data to update.
     * @returns The updated habit.
     * @throws {NotFoundError} If the habit is not found or not accessible.
     */
    async updateHabit(id: string, userId: string, updateData: UpdateHabitDTO): Promise<Habit> {
        // Additional business logic before update, e.g., validation beyond schema,
        // permission checks, or complex state transitions.
        return this.habitsRepository.updateHabit(id, userId, updateData);
    }

    /**
     * Deletes a habit and its associated completions for a given user.
     * @param id - The ID of the habit to delete.
     * @param userId - The ID of the user.
     * @throws {NotFoundError} If the habit is not found or not accessible.
     */
    async deleteHabit(id: string, userId: string): Promise<void> {
        // Potentially implement soft delete (archiving) instead of hard delete here
        // based on business requirements.
        await this.habitsRepository.deleteHabit(id, userId);
    }

    /**
     * Records a completion for a specific habit for a given user.
     * @param habitId - The ID of the habit.
     * @param userId - The ID of the user.
     * @param completionData - The completion details.
     * @returns The created completion record.
     * @throws {NotFoundError} If the habit is not found or not accessible.
     */
    async recordHabitCompletion(habitId: string, userId: string, completionData: RecordCompletionDTO): Promise<HabitCompletion> {
        // Ensure habit exists and belongs to the user is handled in repository.
        // Add any other completion-specific business rules here (e.g., rate limits, notifications).
        return this.habitsRepository.recordHabitCompletion(habitId, userId, completionData);
    }

    /**
     * Retrieves all completion records for a specific habit for a given user.
     * @param habitId - The ID of the habit.
     * @param userId - The ID of the user.
     * @returns An array of habit completion records.
     * @throws {NotFoundError} If the habit is not found or not accessible.
     */
    async getHabitCompletions(habitId: string, userId: string): Promise<HabitCompletion[]> {
        return this.habitsRepository.findHabitCompletions(habitId, userId);
    }
}
