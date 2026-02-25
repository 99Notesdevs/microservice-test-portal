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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestService = void 0;
const TestRepository_1 = require("../repositories/TestRepository");
class TestService {
    static getAllTests() {
        return __awaiter(this, void 0, void 0, function* () {
            const tests = yield TestRepository_1.TestRepository.getAllTests();
            return tests;
        });
    }
    static getTestById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const test = yield TestRepository_1.TestRepository.getTestById(id);
            if (!test) {
                throw new Error(`Test with ID ${id} not found`);
            }
            return test;
        });
    }
    static createTest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTest = yield TestRepository_1.TestRepository.createTest(data);
            return newTest;
        });
    }
    static updateTest(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const test = yield TestRepository_1.TestRepository.getTestById(id);
            if (!test) {
                throw new Error(`Test with ID ${id} not found`);
            }
            const updated = yield TestRepository_1.TestRepository.updateTest(id, data);
            return updated;
        });
    }
    static deleteTest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const test = yield TestRepository_1.TestRepository.getTestById(id);
            if (!test) {
                throw new Error(`Test with ID ${id} not found`);
            }
            const deleted = yield TestRepository_1.TestRepository.deleteTest(id);
            return deleted;
        });
    }
}
exports.TestService = TestService;
