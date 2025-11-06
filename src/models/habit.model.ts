// src/models/habit.model.ts

/**
 * Represents a user's habit.
 */
export interface Habit {
    id: string;          // Unique identifier for the habit (UUID)
    name: string;        // Name of the habit (e.g., "Drink water")
    description?: string; // Optional description
    userId: string;      // The ID of the user who owns this habit
    createdAt: Date;     // Timestamp when the habit was created
    updatedAt: Date;     // Timestamp when the habit was last updated
}

/**
 * Represents a single instance of a habit being completed.
 */
export interface HabitCompletion {
    id: string;           // Unique identifier for the completion record (UUID)
    habitId: string;      // The ID of the habit that was completed
    completionDate: Date; // The date/time when the habit was completed
    notes?: string;       // Optional notes about the completion
    createdAt: Date;      // Timestamp when the completion record was created
}

// --- Data Transfer Objects (DTOs) for API requests ---

/**
 * DTO for creating a new habit.
 * Omits auto-generated fields like 'id', 'createdAt', 'updatedAt'.
 * userId is included here for demonstration, but typically comes from authentication.
 */
export type CreateHabitDTO = Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * DTO for updating an existing habit.
 * Allows partial updates and omits immutable fields.
 */
export type UpdateHabitDTO = Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>;

/**
 * DTO for recording a habit completion.
 * Omits auto-generated fields and habitId (which comes from URL params).
 */
export type RecordCompletionDTO = Omit<HabitCompletion, 'id' | 'createdAt' | 'habitId'>;
