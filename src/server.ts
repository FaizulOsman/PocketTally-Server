/* eslint-disable no-console */
import mongoose from 'mongoose';
import configs from './config';
import app from './app';
import { Server } from 'http';

// Uncaught Exception Error Handler
process.on('uncaughtException', error => {
  console.log(error);
  process.exit(1);
});

let server: Server;

async function bootstrap() {
  try {
    // Connect to the database
    await mongoose.connect(configs.db_url as string);
    console.log('🔥 Database connected 🔥');

    // Start the server
    server = app.listen(configs.port, () => {
      console.log(`Server is running on port ${configs.port}`);
    });
  } catch (error) {
    // Log error if database connection fails
    console.log('Failed to connect to database', error);
  }
  // Gracefully shutting down the server in case of unhandled rejection
  process.on('unhandledRejection', error => {
    console.log(error);

    if (server) {
      // Close the server and log the error
      server.close(() => {
        console.log(error);
        process.exit(1);
      });
    } else {
      // If server is not available, exit the process
      process.exit(1);
    }
  });
}
// Call the bootstrap function to start the application
bootstrap();

// Handling SIGTERM signal
process.on('SIGTERM', () => {
  console.log('SIGTERM is received.');
  if (server) {
    // Close the server gracefully
    server.close();
  }
});
