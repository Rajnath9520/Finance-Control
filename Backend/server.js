
'use strict';
import dotenv from 'dotenv'
dotenv.config();

import app from './app.js';
import connectDB from './config/database.js';


const PORT = process.env.PORT || 5000;


const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Finance Control API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });

  // Graceful Shutdown
  const shutdown = (signal) => {
    console.log(`\n ${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });

    // Force exit if server doesn't close within 10s
    setTimeout(() => {
      console.error('Forcing shutdown after timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Unhandled Rejections

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'Reason:', reason);
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);
  });
};

startServer();