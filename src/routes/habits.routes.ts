// src/routes/habits.routes.ts
import { Router } from 'express';
import { HabitsController } from '../controllers/habits.controller';
import { validate } from '../middlewares/validation.middleware';
import {
    createHabitRequestSchema,
    getHabitByIdRequestSchema,
    updateHabitRequestSchema,
    deleteHabitRequestSchema,
    recordCompletionRequestSchema,
    getHabitCompletionsRequestSchema,
    getAllHabitsRequestSchema,
} from '../schemas/habit.schema';

const router = Router();

// Route for creating a new habit
// POST /api/v1/habits
router.post('/', validate(createHabitRequestSchema), HabitsController.createHabit);

// Route for getting all habits for a user
// GET /api/v1/habits?userId=...
router.get('/', validate(getAllHabitsRequestSchema), HabitsController.getAllHabits);

// Route for getting a single habit by ID
// GET /api/v1/habits/:id
router.get('/:id', validate(getHabitByIdRequestSchema), HabitsController.getHabitById);

// Route for updating a habit by ID
// PUT /api/v1/habits/:id
router.put('/:id', validate(updateHabitRequestSchema), HabitsController.updateHabit);

// Route for deleting a habit by ID
// DELETE /api/v1/habits/:id
router.delete('/:id', validate(deleteHabitRequestSchema), HabitsController.deleteHabit);

// Route for recording a habit completion for a given habit ID
// POST /api/v1/habits/:id/complete
router.post('/:id/complete', validate(recordCompletionRequestSchema), HabitsController.recordHabitCompletion);

// Route for getting all completions for a specific habit
// GET /api/v1/habits/:id/completions
router.get('/:id/completions', validate(getHabitCompletionsRequestSchema), HabitsController.getHabitCompletions);

export default router;
