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
exports.PremiumUserController = void 0;
const premiumUserService_1 = require("../services/premiumUserService");
class PremiumUserController {
    static getUserTests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.authUser);
                const userTests = yield premiumUserService_1.PremiumUserService.getUserTests(userId);
                res.status(200).json({ success: true, data: userTests });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
    static getUserTestSeries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.authUser);
                const userTestSeries = yield premiumUserService_1.PremiumUserService.getUserTestSeries(userId);
                res.status(200).json({ success: true, data: userTestSeries });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
    static getUserTest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const userTest = yield premiumUserService_1.PremiumUserService.getUserTest(id);
                res.status(200).json({ success: true, data: userTest });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
    static getOneUserTestSeries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const userTestSeries = yield premiumUserService_1.PremiumUserService.getOneUserTestSeries(id);
                res.status(200).json({ success: true, data: userTestSeries });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
    static getLast5TestSeriesData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.authUser);
                const last5TestSeries = yield premiumUserService_1.PremiumUserService.getLast5TestSeriesData(userId);
                res.status(200).json({ success: true, data: last5TestSeries });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
    static storeUserTest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const data = {
                    userId: parseInt(req.authUser),
                    questionIds: body.questionIds,
                    response: JSON.stringify(body.response),
                    result: JSON.stringify(body.result),
                };
                const newUserTest = yield premiumUserService_1.PremiumUserService.storeUserTest(data);
                res.status(201).json({ success: true, data: newUserTest });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
    static storeUserTestSeries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const data = {
                    userId: parseInt(req.authUser),
                    testId: body.testId,
                    response: JSON.stringify(body.response),
                    score: parseInt(body.score),
                    result: JSON.stringify(body.result),
                };
                const newUserTestSeries = yield premiumUserService_1.PremiumUserService.storeUserTestSeries(data);
                res.status(201).json({ success: true, data: newUserTestSeries });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
    static updateUserTest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const body = req.body;
                const data = {
                    questionIds: body.questionIds,
                    response: JSON.stringify(body.response),
                    result: JSON.stringify(body.result),
                };
                const updatedUserTest = yield premiumUserService_1.PremiumUserService.updateUserTest(id, data);
                res.status(200).json({ success: true, data: updatedUserTest });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
    static updateUserTestSeries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const body = req.body;
                const data = {
                    testId: body.testId,
                    response: JSON.stringify(body.response),
                    result: JSON.stringify(body.result),
                    score: parseInt(body.score)
                };
                const updatedUserTestSeries = yield premiumUserService_1.PremiumUserService.updateUserTestSeries(id, data);
                res.status(200).json({ success: true, data: updatedUserTestSeries });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
}
exports.PremiumUserController = PremiumUserController;
