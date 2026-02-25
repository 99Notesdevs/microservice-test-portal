"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const logger_1 = __importDefault(require("./utils/logger"));
const socket_1 = require("./config/socket");
const redis_1 = require("redis");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const fetch_worker_1 = require("./utils/Kafka/Workers/fetch-worker");
const submit_worker_1 = require("./utils/Kafka/Workers/submit-worker");
const rating_worker_1 = require("./utils/Kafka/Workers/rating-worker");
const port = Number(process.env.PORT) || 5500;
// Create HTTP server
const server = http_1.default.createServer(app_1.app);
// Setup Socket.IO with the HTTP server
const io = (0, socket_1.setupSocketIO)(server);
// Start kafka consumer
(0, fetch_worker_1.createFetchConsumer)();
(0, submit_worker_1.createSubmitConsumer)();
(0, rating_worker_1.createRatingConsumer)();
// Configure Redis adapter for Socket.IO if Redis is available
if (process.env.REDIS_URL) {
    try {
        const pubClient = (0, redis_1.createClient)({ url: process.env.REDIS_URL });
        const subClient = pubClient.duplicate();
        Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
            io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
            console.log('Socket.IO configured with Redis adapter');
            logger_1.default.info('Socket.IO configured with Redis adapter');
        }).catch((err) => {
            logger_1.default.error(`Error connecting Redis for Socket.IO: ${err.message}`);
        });
    }
    catch (error) {
        logger_1.default.error(`Failed to initialize Redis adapter: ${error instanceof Error ? error.message : String(error)}`);
    }
}
// Start the server
server.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
    logger_1.default.info(`Server running on port ${port}`);
});
// Handle server shutdown gracefully
process.on('SIGTERM', () => {
    logger_1.default.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger_1.default.info('HTTP server closed');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    logger_1.default.info('SIGINT signal received: closing HTTP server');
    server.close(() => {
        logger_1.default.info('HTTP server closed');
        process.exit(0);
    });
});
