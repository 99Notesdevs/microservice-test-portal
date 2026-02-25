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
exports.TestSeriesController = void 0;
const testSeriesService_1 = require("../services/testSeriesService");
class TestSeriesController {
    static getAllTestSeries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const testSeries = yield testSeriesService_1.TestSeriesService.getAllTestSeries();
                res.status(200).json({ success: true, data: testSeries });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
    static getTestSeriesById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const testSeries = yield testSeriesService_1.TestSeriesService.getTestSeriesById(id);
                res.status(200).json({ success: true, data: testSeries });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
    static createTestSeries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const newTestSeries = yield testSeriesService_1.TestSeriesService.createTestSeries(data);
                res.status(201).json({ success: true, data: newTestSeries });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
    static updateTestSeries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const data = req.body;
                const updatedTestSeries = yield testSeriesService_1.TestSeriesService.updateTestSeries(id, data);
                res.status(200).json({ success: true, data: updatedTestSeries });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
    static deleteTestSeries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                yield testSeriesService_1.TestSeriesService.deleteTestSeries(id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
}
exports.TestSeriesController = TestSeriesController;
