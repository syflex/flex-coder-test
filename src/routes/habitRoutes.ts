/**
 * @file src/routes/habitRoutes.ts
 * @description Defines the API routes for habit management.
 *              Includes Swagger/OpenAPI annotations for documentation.
 */

import { Router } from 'express';
import { HabitController } from '../controllers/habitController';

const router = Router();
const habitController = new HabitController();

/**
 * @swagger
 * tags:
 *   name: Habits
 *   description: API for managing user habits.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Habit:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - completed
 *         - createdAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the habit.
 *           example: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
 *         name:
 *           type: string
 *           description: The name of the habit.
 *           example: "Drink 8 glasses of water"
 *         description:
 *           type: string
 *           nullable: true
 *           description: An optional description of the habit.
 *           example: "Stay hydrated throughout the day."
 *         completed:
 *           type: boolean
 *           description: Whether the habit has been marked as complete.
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the habit was created.
 *           example: "2023-10-27T10:00:00.000Z"
 *         completedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: The timestamp when the habit was marked as complete (if applicable).
 *           example: "2023-10-27T18:30:00.000Z"
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *         error:
 *           type: string
 */

/**
 * @swagger
 * /api/habits:
 *   get:
 *     summary: Retrieve a list of all habits
 *     tags: [Habits]
 *     responses:
 *       200:
 *         description: A list of habits, ordered by creation date (newest first).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Habits retrieved successfully." }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Habit'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/', habitController.getHabits);

/**
 * @swagger
 * /api/habits:
 *   post:
 *     summary: Create a new habit
 *     tags: [Habits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the habit (min 1, max 100 characters).
 *                 example: "Go for a walk"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 description: Optional description of the habit (max 500 characters).
 *                 example: "Walk for at least 30 minutes in the morning."
 *     responses:
 *       201:
 *         description: The created habit.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Habit created successfully." }
 *                 data:
 *                   $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Invalid input (e.g., missing name, name too long).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/', habitController.createHabit);

/**
 * @swagger
 * /api/habits/{id}:
 *   get:
 *     summary: Get a single habit by ID
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the habit to retrieve.
 *     responses:
 *       200:
 *         description: A single habit object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Habit retrieved successfully." }
 *                 data:
 *                   $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Invalid ID format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Habit not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/:id', habitController.getHabitById);

/**
 * @swagger
 * /api/habits/{id}:
 *   put:
 *     summary: Update an existing habit (name or description)
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the habit to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name for the habit (min 1, max 100 characters).
 *                 example: "Walk 10,000 steps"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 description: New description for the habit (max 500 characters).
 *                 example: "Aim for 10,000 steps daily using a fitness tracker."
 *             minProperties: 1
 *             additionalProperties: false
 *     responses:
 *       200:
 *         description: The updated habit.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Habit updated successfully." }
 *                 data:
 *                   $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Invalid input (e.g., invalid fields, no fields provided, invalid ID).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Habit not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.put('/:id', habitController.updateHabit);

/**
 * @swagger
 * /api/habits/{id}/complete:
 *   patch:
 *     summary: Mark a habit as complete
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the habit to mark as complete.
 *     responses:
 *       200:
 *         description: The updated habit, now marked as complete.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Habit marked as complete successfully." }
 *                 data:
 *                   $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Invalid ID format or habit is already complete.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Habit not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.patch('/:id/complete', habitController.markHabitComplete);

/**
 * @swagger
 * /api/habits/{id}:
 *   delete:
 *     summary: Delete a habit by ID
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the habit to delete.
 *     responses:
 *       204:
 *         description: Habit deleted successfully (no content).
 *       400:
 *         description: Invalid ID format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Habit not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete('/:id', habitController.deleteHabit);

export default router;
