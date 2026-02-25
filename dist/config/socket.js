"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketIO = void 0;
const socket_io_1 = require("socket.io");
const socketInstance_1 = require("./socketInstance");
const logger_1 = __importDefault(require("../utils/logger"));
const setupSocketIO = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "OPTIONS"],
            credentials: true
        },
        path: "/socket.io",
        transports: ["websocket", "polling"],
        pingTimeout: 60000,
        connectTimeout: 60000
    });
    (0, socketInstance_1.setSocketInstance)(io);
    io.on('connection', (socket) => {
        logger_1.default.info(`User connected: ${socket.id}`);
        socket.on('join_room', (data) => {
            const { userId } = JSON.parse(data);
            socket.join(`room-${userId}`);
            logger_1.default.info(`User ${socket.id} joined room: room-${userId}`);
        });
        socket.on('disconnect', () => {
            logger_1.default.info(`User disconnected: ${socket.id}`);
        });
    });
    return io;
};
exports.setupSocketIO = setupSocketIO;
