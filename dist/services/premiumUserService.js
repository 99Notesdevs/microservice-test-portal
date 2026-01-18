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
exports.PremiumUserService = void 0;
const PremiumUserRepository_1 = require("../repositories/PremiumUserRepository");
class PremiumUserService {
    static getUserTests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PremiumUserRepository_1.PremiumUserRepository.getUserTests(userId);
        });
    }
    static getUserTestSeries(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PremiumUserRepository_1.PremiumUserRepository.getUserTestSeries(userId);
        });
    }
    static getUserTest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userTest = yield PremiumUserRepository_1.PremiumUserRepository.getUserTest(id);
            if (!userTest) {
                throw new Error(`User test with ID ${id} not found`);
            }
            return userTest;
        });
    }
    static getOneUserTestSeries(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userTestSeries = yield PremiumUserRepository_1.PremiumUserRepository.getOneUserTestSeries(id);
            if (!userTestSeries) {
                throw new Error(`User test series with ID ${id} not found`);
            }
            return userTestSeries;
        });
    }
    static getLast5TestSeriesData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const last5 = yield PremiumUserRepository_1.PremiumUserRepository.getUserTestSeriesScore(userId);
            if (!last5) {
                throw new Error(`No test series found for user ID ${userId}`);
            }
            for (const series of last5) {
                series['averageScore'] = yield PremiumUserRepository_1.PremiumUserRepository.getAverageScore(series.testId);
                series['bestScore'] = yield PremiumUserRepository_1.PremiumUserRepository.getBestScore(series.testId);
            }
            return last5;
        });
    }
    static storeUserTest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PremiumUserRepository_1.PremiumUserRepository.storeUserTest(data);
        });
    }
    static storeUserTestSeries(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PremiumUserRepository_1.PremiumUserRepository.storeUserTestSeries(data);
        });
    }
    static updateUserTest(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const userTest = yield PremiumUserRepository_1.PremiumUserRepository.getUserTest(id);
            if (!userTest) {
                throw new Error(`User test with ID ${id} not found`);
            }
            return yield PremiumUserRepository_1.PremiumUserRepository.updateUserTest(id, data);
        });
    }
    static updateUserTestSeries(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const userTestSeries = yield PremiumUserRepository_1.PremiumUserRepository.getOneUserTestSeries(id);
            if (!userTestSeries) {
                throw new Error(`User test series with ID ${id} not found`);
            }
            return yield PremiumUserRepository_1.PremiumUserRepository.updateUserTestSeries(id, data);
        });
    }
}
exports.PremiumUserService = PremiumUserService;
