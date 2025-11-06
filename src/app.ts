/**
 * @file src/app.ts
 * @description Main Express application configuration.
 *              Sets up middleware, API routes, and frontend serving.
 */

import express from 'express';
import path from 'path'; // Node.js built-in module for path manipulation
import habitRoutes from './routes/habitRoutes'; // Import habit API routes
import { errorHandler } from './middlewares/errorHandler'; // Import global error handler

const app = express();

// --- Core Middleware ---
// Parses incoming requests with JSON payloads.
// This is essential for our API to receive JSON data (e.g., when creating a habit).
app.use(express.json());

// Parses incoming requests with URL-encoded payloads.
// Useful for traditional HTML form submissions, though our current frontend uses JSON fetch.
app.use(express.urlencoded({ extended: true }));

// --- Frontend Serving ---
// Serves static files (HTML, CSS, client-side JS) from the 'src/views' directory.
// When a request comes in that doesn't match an API route, Express will look for a static file.
// In a production setup with a dedicated frontend build, this would typically point to a 'dist' or 'public' folder.
app.use(express.static(path.join(__dirname, 'views')));

// --- API Routes ---
// Mounts the habit routes under the '/api/habits' prefix.
// All requests starting with /api/habits will be handled by habitRoutes.
app.use('/api/habits', habitRoutes);

// --- Frontend Entry Point ---
// A catch-all route to serve the main 'habits.html' page for any request
// that hasn't been handled by other static files or API routes.
// This is typical for single-page applications (SPAs) where client-side routing takes over.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'habits.html'));
});

// --- Global Error Handling ---
// This middleware must be placed LAST, after all other routes and middleware.
// It catches any errors thrown during request processing and sends a standardized error response.
app.use(errorHandler);

export default app;
