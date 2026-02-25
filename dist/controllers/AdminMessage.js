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
exports.AdminMessageController = void 0;
const AdminMessageService_1 = require("../services/AdminMessageService");
class AdminMessageController {
    static getGlobalMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = Number(req.query.skip) || 0;
            const take = Number(req.query.take) || 10;
            try {
                const messages = yield AdminMessageService_1.AdminMessageService.getGlobalMessages(skip, take);
                res.status(200).json({ success: true, data: messages });
            }
            catch (error) {
                res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static getMessageByRating(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const rating = Number(req.params.rating);
            const skip = Number(req.query.skip) || 0;
            const take = Number(req.query.take) || 10;
            try {
                const messages = yield AdminMessageService_1.AdminMessageService.getMessageByRating(rating, skip, take);
                res.status(200).json({ success: true, data: messages });
            }
            catch (error) {
                res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static getMessageById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            try {
                const message = yield AdminMessageService_1.AdminMessageService.getMessageById(id);
                if (!message) {
                    throw new Error("Message not found");
                }
                res.json({ success: true, data: message });
            }
            catch (error) {
                res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static createMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    type: req.body.type,
                    content: req.body.content,
                    ratingS: req.body.ratingS,
                    ratingE: req.body.ratingE,
                };
                if (!data.type || !data.content) {
                    throw new Error("Type and content are required");
                }
                if (data.ratingS && data.ratingE && data.ratingS > data.ratingE) {
                    throw new Error("Invalid rating range: ratingS should be less than or equal to ratingE");
                }
                const message = yield AdminMessageService_1.AdminMessageService.createMessage(data);
                res.status(201).json({ success: true, data: message });
            }
            catch (error) {
                res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static updateMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            try {
                const data = {
                    type: req.body.type,
                    content: req.body.content,
                    ratingS: req.body.ratingS,
                    ratingE: req.body.ratingE,
                };
                if (!data.type && !data.content && !data.ratingS && !data.ratingE) {
                    throw new Error("At least one field (type, content, ratingS, ratingE) is required for update");
                }
                if (data.ratingS && data.ratingE && data.ratingS > data.ratingE) {
                    throw new Error("Invalid rating range: ratingS should be less than or equal to ratingE");
                }
                const message = yield AdminMessageService_1.AdminMessageService.updateMessage(id, data);
                res.status(200).json({ success: true, data: message });
            }
            catch (error) {
                res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static deleteMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            try {
                const message = yield AdminMessageService_1.AdminMessageService.deleteMessage(id);
                res.status(200).json({ success: true, data: message });
            }
            catch (error) {
                res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
}
exports.AdminMessageController = AdminMessageController;
