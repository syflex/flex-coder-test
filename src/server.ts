// src/server.ts
import app from './app';
import { connectDb, disconnectDb } from './database';

// Define the port the server will listen on, from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

/**
 * Starts the Express server and connects to the database.
 */
const startServer = async () => {
    try {
        await connectDb(); // Connect to the database (or simulate connection)
        app.listen(PORT, () => {
            console.log(`⚡️[server]: Server is running on http://localhost:${PORT}`);
            console.log(`⚡️[server]: Health check at http://localhost:${PORT}/`);
            console.log(`⚡️[server]: API docs at http://localhost:${PORT}/api/v1/habits`);
        });
    } catch (error) {
        console.error('❌[server]: Failed to start server:', error);
        // Exit the process with a failure code
        process.exit(1);
    }
};

/**
 * Handles graceful shutdown of the server and database connection.
 */
const gracefulShutdown = async () => {
    console.log('\n gracefulShutdown: Initiating server shutdown...');
    try {
        await disconnectDb(); // Disconnect from the database (or simulate disconnection)
        console.log('gracefulShutdown: Database disconnected.');
        process.exit(0); // Exit cleanly
    } catch (error) {
        console.error('gracefulShutdown: Error during shutdown:', error);
        process.exit(1); // Exit with error
    }
};

// Listen for termination signals for graceful shutdown
process.on('SIGTERM', gracefulShutdown); // Kubernetes, Heroku, etc.
process.on('SIGINT', gracefulShutdown);  // Ctrl+C in terminal

// Start the server
startServer();
