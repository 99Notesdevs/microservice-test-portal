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
exports.TestRepository = void 0;
const prisma_1 = require("../config/prisma");
const logger_1 = __importDefault(require("../utils/logger"));
class TestRepository {
    static getAllTests() {
        return __awaiter(this, void 0, void 0, function* () {
            const tests = yield prisma_1.prisma.tests.findMany();
            logger_1.default.info(`Fetched all tests: ${JSON.stringify(tests)}`);
            return tests;
        });
    }
    static getTestById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const test = yield prisma_1.prisma.tests.findUnique({
                where: { id },
            });
            logger_1.default.info(`Fetched test by ID ${id}: ${JSON.stringify(test)}`);
            return test;
        });
    }
    static createTest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const test = yield prisma_1.prisma.tests.create({
                data: {
                    name: data.name,
                    correctAttempted: data.correctAttempted,
                    wrongAttempted: data.wrongAttempted,
                    notAttempted: data.notAttempted,
                    partialAttempted: data.partialAttempted,
                    partialNotAttempted: data.partialNotAttempted,
                    partialWrongAttempted: data.partialWrongAttempted,
                    timeTaken: data.timeTaken,
                    questionsSingle: data.questionsSingle,
                    questionsMultiple: data.questionsMultiple
                }
            });
            logger_1.default.info(`Created test: ${JSON.stringify(test)}`);
            return test;
        });
    }
    static updateTest(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const test = yield prisma_1.prisma.tests.update({
                where: { id },
                data: {
                    name: data.name,
                    correctAttempted: data.correctAttempted,
                    wrongAttempted: data.wrongAttempted,
                    notAttempted: data.notAttempted,
                    partialAttempted: data.partialAttempted,
                    partialNotAttempted: data.partialNotAttempted,
                    partialWrongAttempted: data.partialWrongAttempted,
                    timeTaken: data.timeTaken,
                    questionsSingle: data.questionsSingle,
                    questionsMultiple: data.questionsMultiple
                }
            });
            logger_1.default.info(`Updated test: ${JSON.stringify(test)}`);
            return test;
        });
    }
    static deleteTest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const test = yield prisma_1.prisma.tests.delete({
                where: { id },
            });
            logger_1.default.info(`Deleted test: ${JSON.stringify(test)}`);
            return test;
        });
    }
}
exports.TestRepository = TestRepository;
