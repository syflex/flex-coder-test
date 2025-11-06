/**
 * @file src/models/Habit.ts
 * @description Defines the interface for a Habit entity.
 */

/**
 * Interface representing a Habit.
 * This structure is used across the application for habit data.
 */
export interface Habit {
    id: string; // Unique identifier for the habit, e.g., a UUID
    name: string; // The name or title of the habit
    description?: string; // Optional longer description for the habit
    completed: boolean; // Flag indicating if the habit has been completed
    createdAt: Date; // Timestamp when the habit was created
    completedAt?: Date; // Optional timestamp when the habit was marked as complete
}
