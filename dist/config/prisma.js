"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// import logger from "../utils/logger";
console.log("Prisma client created");
// logger.info("Prisma client created");
exports.prisma = new client_1.PrismaClient();
