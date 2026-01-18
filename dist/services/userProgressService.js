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
exports.UserProgressService = void 0;
const userProgressRepository_1 = require("../repositories/userProgressRepository");
class UserProgressService {
    // Get user progress for a specific user
    static getUserProgress(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userProgressRepository_1.UserProgressRepository.getUserProgress(userId);
        });
    }
    // Get user progress for a specific date
    static getUserProgressByDate(userId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userProgressRepository_1.UserProgressRepository.getUserProgressByDate(userId, date);
        });
    }
    // Update user progress for a specific user
    static updateUserProgress(userId, progress) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentProgress = yield userProgressRepository_1.UserProgressRepository.getUserProgressByDate(userId, new Date());
            let progressMin = (currentProgress === null || currentProgress === void 0 ? void 0 : currentProgress.progressMin) || progress;
            let progressMax = (currentProgress === null || currentProgress === void 0 ? void 0 : currentProgress.progressMax) || progress;
            progressMin = Math.min(progressMin, progress);
            progressMax = Math.max(progressMax, progress);
            return yield userProgressRepository_1.UserProgressRepository.updateUserProgress(userId, progressMin, progressMax);
        });
    }
}
exports.UserProgressService = UserProgressService;
