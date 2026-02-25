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
exports.ProgressConstraintsService = void 0;
const progressContraintsRepository_1 = require("../repositories/progressContraintsRepository");
const logger_1 = __importDefault(require("../utils/logger"));
class ProgressConstraintsService {
    static getProgressConstraintsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const progressConstraints = yield progressContraintsRepository_1.ProgressConstraintsRepository.getProgressConstraintsById(id);
            if (!progressConstraints) {
                logger_1.default.warn(`Progress constraints not found for ID: ${id}`);
            }
            return progressConstraints;
        });
    }
    static createProgressConstraints(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newProgressConstraints = yield progressContraintsRepository_1.ProgressConstraintsRepository.createProgressConstraints(data);
            logger_1.default.info(`Created new progress constraints with ID: ${newProgressConstraints.id}`);
            return newProgressConstraints;
        });
    }
    static updateProgressConstraints(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedProgressConstraints = yield progressContraintsRepository_1.ProgressConstraintsRepository.updateProgressConstraints(id, data);
            if (!updatedProgressConstraints) {
                logger_1.default.warn(`Progress constraints not found for ID: ${id}`);
                return null;
            }
            logger_1.default.info(`Updated progress constraints with ID: ${id}`);
            return updatedProgressConstraints;
        });
    }
}
exports.ProgressConstraintsService = ProgressConstraintsService;
