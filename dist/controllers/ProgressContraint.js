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
            const progressConstraints = yield progressConstraintService_1.ProgressConstraintsService.getProgressConstraintsById(1);
            if (!progressConstraints) {
                throw new Error("Progress constraints not found");
            }
            res.status(200).json({ success: true, data: progressConstraints });
        });
    }
    static createProgressConstraints(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { weakLimit, strongLimit, xp_status } = req.body;
            if (typeof weakLimit !== 'number' || typeof strongLimit !== 'number' || typeof xp_status !== 'string') {
                throw new Error("Invalid input data");
            }
            const newProgressConstraints = yield progressConstraintService_1.ProgressConstraintsService.createProgressConstraints({
                weakLimit,
                strongLimit,
                xp_status
            });
            res.status(201).json({ success: true, data: newProgressConstraints });
        });
    }
    static updateProgressConstraints(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { weakLimit, strongLimit, xp_status } = req.body;
            if (typeof weakLimit !== 'number' || typeof strongLimit !== 'number' || typeof xp_status !== 'string') {
                throw new Error("Invalid input data");
            }
            const updatedProgressConstraints = yield progressConstraintService_1.ProgressConstraintsService.updateProgressConstraints(Number(id), {
                weakLimit,
                strongLimit,
                xp_status
            });
            if (!updatedProgressConstraints) {
                res.status(404).json({ success: false, error: "Progress constraints not found" });
                return;
            }
            res.status(200).json({ success: true, data: updatedProgressConstraints });
        });
    }
}
exports.ProgressConstraintController = ProgressConstraintController;
