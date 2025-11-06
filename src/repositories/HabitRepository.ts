/**
 * @file src/repositories/HabitRepository.ts
 * @description Implements an in-memory data store for Habit entities.
 *              In a real application, this would interact with a persistent database.
 */

import { Habit } from '../models/Habit';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// In-memory array to store Habit objects for demonstration purposes.
// This data will be lost when the server restarts.
const habits: Habit[] = [];

/**
 * Repository class responsible for data access operations related to Habits.
 * This class abstracts away the data storage mechanism.
 */
export class HabitRepository {
    /**
     * Finds all habits in the store.
     * @returns A promise that resolves to an array of Habit objects, sorted by creation date (newest first).
     */
    async findAll(): Promise<Habit[]> {
        // Return a shallow copy and sort to avoid direct mutation of the internal array
        return [...habits].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    /**
     * Finds a single habit by its unique ID.
     * @param id The ID of the habit to find.
     * @returns A promise that resolves to the Habit object if found, otherwise undefined.
     */
    async findById(id: string): Promise<Habit | undefined> {
        return habits.find(habit => habit.id === id);
    }

    /**
     * Creates a new habit and adds it to the store.
     * Generates a new UUID for the habit and sets initial properties.
     * @param habitData An object containing the name and optional description for the new habit.
     * @returns A promise that resolves to the newly created Habit object.
     */
    async create(habitData: { name: string; description?: string }): Promise<Habit> {
        const newHabit: Habit = {
            id: uuidv4(),
            name: habitData.name,
            description: habitData.description,
            completed: false,
            createdAt: new Date(),
        };
        habits.push(newHabit); // Add the new habit to the in-memory array
        return newHabit;
    }

    /**
     * Updates an existing habit by its ID with partial data.
     * @param id The ID of the habit to update.
     * @param updates A partial Habit object containing the fields to update.
     * @returns A promise that resolves to the updated Habit object if found, otherwise undefined.
     */
    async update(id: string, updates: Partial<Habit>): Promise<Habit | undefined> {
        const index = habits.findIndex(habit => habit.id === id);
        if (index === -1) {
            return undefined; // Habit not found
        }
        // Merge existing habit data with updates
        habits[index] = { ...habits[index], ...updates };
        return habits[index];
    }

    /**
     * Deletes a habit from the store by its ID.
     * @param id The ID of the habit to delete.
     * @returns A promise that resolves to true if the habit was found and deleted, false otherwise.
     */
    async delete(id: string): Promise<boolean> {
        const initialLength = habits.length;
        const index = habits.findIndex(habit => habit.id === id);
        if (index > -1) {
            habits.splice(index, 1); // Remove the habit from the array
        }
        return habits.length < initialLength; // True if an item was removed
    }
}
