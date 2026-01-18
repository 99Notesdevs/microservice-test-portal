"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressConstraintsRepository = void 0;
const prisma_1 = require("../config/prisma");
const logger_1 = __importDefault(require("../utils/logger"));
const RedisClient_1 = __importDefault(require("../config/RedisClient"));
class ProgressConstraintsRepository {
    static getProgressConstraintsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Fetching progress constraints by ID: ${id}`);
            const cacheKey = `progressConstraints:${id}`;
            const cachedProgressConstraints = yield RedisClient_1.default.get(cacheKey);
            if (cachedProgressConstraints) {
                logger_1.default.info(`Returning cached progress constraints for ID: ${id}`);
                return JSON.parse(cachedProgressConstraints);
            }
            const progressConstraints = yield prisma_1.prisma.progressConstraints.findUnique({
                where: { id },
            });
            if (!progressConstraints) {
                logger_1.default.warn(`Progress constraints with ID ${id} not found`);
                throw new Error(`Progress constraints with ID ${id} not found`);
            }
            yield RedisClient_1.default.setex(cacheKey, this.cacheTTL, JSON.stringify(progressConstraints));
            logger_1.default.info(`Fetched progress constraints for ID: ${id}`);
            return progressConstraints;
        });
    }
    static createProgressConstraints(data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Creating progress constraints with data:`, data);
            const newProgressConstraints = yield prisma_1.prisma.progressConstraints.upsert({
                where: { id: 1 },
                update: {
                    weakLimit: data.weakLimit,
                    strongLimit: data.strongLimit,
                    xp_status: data.xp_status,
                },
                create: {
                    weakLimit: data.weakLimit,
                    strongLimit: data.strongLimit,
                    xp_status: data.xp_status,
                }
            });
            yield RedisClient_1.default.setex(`progressConstraints:1`, this.cacheTTL, JSON.stringify(newProgressConstraints));
            return newProgressConstraints;
        });
    }
    static updateProgressConstraints(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Updating progress constraints with ID: ${id} with data:`, data);
            const updatedProgressConstraints = yield prisma_1.prisma.progressConstraints.update({
                where: { id },
                data: {
                    weakLimit: data.weakLimit,
                    strongLimit: data.strongLimit,
                    xp_status: data.xp_status,
                },
            });
            yield RedisClient_1.default.setex(`progressConstraints:${id}`, this.cacheTTL, JSON.stringify(updatedProgressConstraints));
            logger_1.default.info(`Updated progress constraints for ID: ${id}`);
            return updatedProgressConstraints;
        });
    }
}
exports.ProgressConstraintsRepository = ProgressConstraintsRepository;
ProgressConstraintsRepository.cacheTTL = 60 * 60;
