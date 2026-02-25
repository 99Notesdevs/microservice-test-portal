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
exports.AdminMessageService = void 0;
const AdminMessageRepository_1 = require("../repositories/AdminMessageRepository");
class AdminMessageService {
    static getGlobalMessages(skip, take) {
        return __awaiter(this, void 0, void 0, function* () {
            return AdminMessageRepository_1.AdminMessageRepository.getGlobalMessages(skip, take);
        });
    }
    static getMessageByRating(rating, skip, take) {
        return __awaiter(this, void 0, void 0, function* () {
            return AdminMessageRepository_1.AdminMessageRepository.getMessageByRating(rating, skip, take);
        });
    }
    static getMessageById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return AdminMessageRepository_1.AdminMessageRepository.getMessageById(id);
        });
    }
    static createMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return AdminMessageRepository_1.AdminMessageRepository.createMessage(data);
        });
    }
    static updateMessage(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return AdminMessageRepository_1.AdminMessageRepository.updateMessage(id, data);
        });
    }
    static deleteMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return AdminMessageRepository_1.AdminMessageRepository.deleteMessage(id);
        });
    }
}
exports.AdminMessageService = AdminMessageService;
