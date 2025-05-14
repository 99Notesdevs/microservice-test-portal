import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { setSocketInstance } from './socketInstance';
import logger from '../utils/logger';

export const setupSocketIO = (server: HTTPServer) => {
  const io = new Server(server, {
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

  setSocketInstance(io);

  io.on('connection', (socket: Socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.on('join_room', (data: string) => {
      const { userId } = JSON.parse(data);
      socket.join(`room-${userId}`);
      logger.info(`User ${socket.id} joined room: room-${userId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
