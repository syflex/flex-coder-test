// src/database/index.ts
// This file simulates a database connection and provides in-memory storage for demonstration.
// In a real application, this would connect to a persistent database (e.g., PostgreSQL, MongoDB)
// using an ORM or client library (e.g., Knex, Prisma, Mongoose).

import { Habit, HabitCompletion } from '../models/habit.model';

/**
 * Interface for the in-memory database structure.
 */
interface Database {
    habits: Habit[];
    habitCompletions: HabitCompletion[];
    nextHabitId: number; // Simulates auto-incrementing IDs for habits if not using UUID
    nextCompletionId: number; // Simulates auto-incrementing IDs for completions if not using UUID
}

// Global in-memory storage
const db: Database = {
    habits: [],
    habitCompletions: [],
    nextHabitId: 1,
    nextCompletionId: 1,
};

/**
 * Returns the current state of the in-memory database.
 */
export const getDb = () => db;

/**
 * Simulates a database connection.
 * In a real app, this would initialize the DB client.
 */
export const connectDb = async () => {
    console.log('[DB] Simulating database connection...');
    // In a real app: await initializeDatabaseConnection(); e.g., PrismaClient().$connect();
    console.log('[DB] Database connection simulated successfully.');
};

/**
 * Simulates a database disconnection.
 * In a real app, this would close the DB client connection.
 */
export const disconnectDb = async () => {
    console.log('[DB] Simulating database disconnection...');
    // In a real app: await closeDatabaseConnection(); e.g., PrismaClient().$disconnect();
    console.log('[DB] Database disconnection simulated successfully.');
};

/**
 * Resets the in-memory database to its initial empty state.
 * Useful for testing or development.
 */
export const resetDb = () => {
    db.habits = [];
    db.habitCompletions = [];
    db.nextHabitId = 1;
    db.nextCompletionId = 1;
    console.log('[DB] In-memory database reset.');
};
