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
exports.UserProgressController = void 0;
const userProgressService_1 = require("../services/userProgressService");
const logger_1 = __importDefault(require("../utils/logger"));
class UserProgressController {
    // Get user progress for a specific user
    static getUserProgress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.params.userId);
                const progress = yield userProgressService_1.UserProgressService.getUserProgress(userId);
                res.json({ success: true, data: progress });
            }
            catch (error) {
                logger_1.default.error("Error fetching user progress:", error);
                res.status(500).json({ success: false, error: "Failed to fetch user progress" });
            }
        });
    }
}
exports.UserProgressController = UserProgressController;
