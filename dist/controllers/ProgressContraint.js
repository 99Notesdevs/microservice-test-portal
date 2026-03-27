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
exports.ProgressConstraintController = void 0;
const progressConstraintService_1 = require("../services/progressConstraintService");
class ProgressConstraintController {
    static getProgressConstraintsById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const progressConstraints = yield progressConstraintService_1.ProgressConstraintsService.getProgressConstraintsById(1);
                if (!progressConstraints) {
                    res.status(404).json({ success: false, message: "Progress constraints not found" });
                    return;
                }
                res.status(200).json({ success: true, data: progressConstraints });
            }
            catch (error) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    static createProgressConstraints(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { weakLimit, strongLimit, xp_status } = req.body;
                if (typeof weakLimit !== 'number' || typeof strongLimit !== 'number' || typeof xp_status !== 'string') {
                    res.status(400).json({ success: false, message: "Invalid input data" });
                    return;
                }
                const newProgressConstraints = yield progressConstraintService_1.ProgressConstraintsService.createProgressConstraints({
                    weakLimit,
                    strongLimit,
                    xp_status
                });
                res.status(201).json({ success: true, data: newProgressConstraints });
            }
            catch (error) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    static updateProgressConstraints(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { weakLimit, strongLimit, xp_status } = req.body;
                if (typeof weakLimit !== 'number' || typeof strongLimit !== 'number' || typeof xp_status !== 'string') {
                    res.status(400).json({ success: false, message: "Invalid input data" });
                    return;
                }
                const updatedProgressConstraints = yield progressConstraintService_1.ProgressConstraintsService.updateProgressConstraints(Number(id), {
                    weakLimit,
                    strongLimit,
                    xp_status
                });
                if (!updatedProgressConstraints) {
                    res.status(404).json({ success: false, message: "Progress constraints not found" });
                    return;
                }
                res.status(200).json({ success: true, data: updatedProgressConstraints });
            }
            catch (error) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.ProgressConstraintController = ProgressConstraintController;
