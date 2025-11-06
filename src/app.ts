// src/app.ts
import express from 'express';
import cors from 'cors'; // Cross-Origin Resource Sharing
import helmet from 'helmet'; // Security headers
import morgan from 'morgan'; // HTTP request logger
import habitsRoutes from './routes/habits.routes';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { NotFoundError } from './utils/errors';

const app = express();

// --- Application-level Middleware ---

// Enable CORS for all origins (customize as needed in production)
app.use(cors());

// Set various HTTP headers for security
app.use(helmet());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies (e.g., from HTML forms)
app.use(express.urlencoded({ extended: true }));

// HTTP request logger (using 'dev' format for development)
app.use(morgan('dev'));

// --- Routes ---

// Root route for basic API health check or info
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Habit Tracker API! Access /api/v1/habits for the habit endpoints.' });
});

// Mount the habits routes under a specific API version prefix
app.use('/api/v1/habits', habitsRoutes);

// --- Error Handling Middleware ---

// Catch-all for 404 Not Found errors: If no route handled the request
app.use((req, res, next) => {
    next(new NotFoundError(`The resource "${req.originalUrl}" was not found.`));
});

// Global error handler: This must be the last middleware in the chain
app.use(errorHandler);

export default app;
