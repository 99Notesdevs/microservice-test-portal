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
exports.TestSeriesService = void 0;
const TestSeriesRepository_1 = require("../repositories/TestSeriesRepository");
class TestSeriesService {
    static getAllTestSeries() {
        return __awaiter(this, void 0, void 0, function* () {
            const testSeries = yield TestSeriesRepository_1.TestSeriesRepository.getAllTestSeries();
            return testSeries;
        });
    }
    static getTestSeriesById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const testSeries = yield TestSeriesRepository_1.TestSeriesRepository.getTestSeriesById(id);
            if (!testSeries) {
                throw new Error(`Test series with ID ${id} not found`);
            }
            return testSeries;
        });
    }
    static createTestSeries(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newtestSeries = yield TestSeriesRepository_1.TestSeriesRepository.createTestSeries(data);
            return newtestSeries;
        });
    }
    static updateTestSeries(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const testSeries = yield TestSeriesRepository_1.TestSeriesRepository.getTestSeriesById(id);
            if (!testSeries) {
                throw new Error(`Test series with ID ${id} not found`);
            }
            const updated = yield TestSeriesRepository_1.TestSeriesRepository.updateTestSeries(id, data);
            return updated;
        });
    }
    static deleteTestSeries(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const testSeries = yield TestSeriesRepository_1.TestSeriesRepository.getTestSeriesById(id);
            if (!testSeries) {
                throw new Error(`Test series with ID ${id} not found`);
            }
            const deleted = yield TestSeriesRepository_1.TestSeriesRepository.deleteTestSeries(id);
            return deleted;
        });
    }
}
exports.TestSeriesService = TestSeriesService;
