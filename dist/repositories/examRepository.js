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
exports.ExamRepository = void 0;
const prisma_1 = require("../config/prisma");
const logger_1 = __importDefault(require("../utils/logger"));
class ExamRepository {
    static findOrCreateByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("findOrCreateByName called", { name });
            const existing = yield prisma_1.prisma.exam.findUnique({ where: { name } });
            if (existing)
                return existing;
            const created = yield prisma_1.prisma.exam.create({ data: { name } });
            logger_1.default.info("findOrCreateByName created", { id: created.id });
            return created;
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.prisma.exam.findUnique({ where: { id } });
        });
    }
}
exports.ExamRepository = ExamRepository;
