import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { app } from './app';
import logger from './utils/logger';
import { setupSocketIO } from './config/socket';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { createFetchConsumer } from './utils/Kafka/Workers/fetch-worker';
import { createSubmitConsumer } from './utils/Kafka/Workers/submit-worker';
import { createRatingConsumer } from './utils/Kafka/Workers/rating-worker';


const port = Number(process.env.PORT ) || 5500;

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO with the HTTP server
const io = setupSocketIO(server);

// Start kafka consumer
createFetchConsumer();
createSubmitConsumer();
createRatingConsumer();

// Configure Redis adapter for Socket.IO if Redis is available
if (process.env.REDIS_URL) {
  try {
    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();

    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
      io.adapter(createAdapter(pubClient, subClient));
      console.log('Socket.IO configured with Redis adapter');
      logger.info('Socket.IO configured with Redis adapter');
    }).catch((err) => {
      logger.error(`Error connecting Redis for Socket.IO: ${err.message}`);
    });
  } catch (error) {
    logger.error(`Failed to initialize Redis adapter: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Start the server
server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
  logger.info(`Server running on port ${port}`);
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});