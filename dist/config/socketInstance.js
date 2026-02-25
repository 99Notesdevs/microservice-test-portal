"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketInstance = exports.setSocketInstance = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
let io = null;
let ioInitialized = false;
const setSocketInstance = (ioInstance) => {
    if (ioInitialized) {
        logger_1.default.warn('Socket.IO instance is already initialized');
        return;
    }
    ioInitialized = true;
    logger_1.default.info('Socket.IO instance initialized');
    io = ioInstance;
};
exports.setSocketInstance = setSocketInstance;
const getSocketInstance = () => {
    if (!io) {
        logger_1.default.error('Socket.IO instance not initialized');
        throw new Error('Socket.IO instance not initialized');
    }
    return io;
};
exports.getSocketInstance = getSocketInstance;
