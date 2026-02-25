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
exports.TestController = void 0;
const testService_1 = require("../services/testService");
class TestController {
    static getAllTests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tests = yield testService_1.TestService.getAllTests();
                res.status(200).json({ success: true, data: tests });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
    static getTestById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const test = yield testService_1.TestService.getTestById(id);
                res.status(200).json({ success: true, data: test });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
    static createTest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const newTest = yield testService_1.TestService.createTest(data);
                res.status(201).json({ success: true, data: newTest });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
    static updateTest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const data = req.body;
                const updatedTest = yield testService_1.TestService.updateTest(id, data);
                res.status(200).json({ success: true, data: updatedTest });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
    static deleteTest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                yield testService_1.TestService.deleteTest(id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
}
exports.TestController = TestController;
