/**
 * @file src/server.ts
 * @description Entry point for starting the Express server.
 */

import app from './app'; // Import the configured Express application

// Define the port the server will listen on.
// Uses an environment variable `PORT` if available, otherwise defaults to 3000.
const PORT = process.env.PORT || 3000;

// Start the Express server.
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access habit management frontend at: http://localhost:${PORT}`);
    console.log(`Access habit API endpoints at: http://localhost:${PORT}/api/habits`);
});
