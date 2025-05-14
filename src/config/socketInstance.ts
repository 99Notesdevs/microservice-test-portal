import { Server } from 'socket.io';
import logger from '../utils/logger';

let io: Server | null = null;

let ioInitialized = false;

export const setSocketInstance = (ioInstance: Server) => {
  if (ioInitialized) {
    logger.warn('Socket.IO instance is already initialized');
    return;
  }
  ioInitialized = true;
  logger.info('Socket.IO instance initialized');
  io = ioInstance;
};

export const getSocketInstance = (): Server => {
  if (!io) {
    logger.error('Socket.IO instance not initialized');
    throw new Error('Socket.IO instance not initialized');
  }
  return io;
};
