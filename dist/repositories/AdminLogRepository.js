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
exports.AdminLogRepository = void 0;
const prisma_1 = require("../config/prisma");
class AdminLogRepository {
    static createLog(_a) {
        return __awaiter(this, arguments, void 0, function* ({ method, endpoint, status, user, userId, details, }) {
            return prisma_1.prisma.adminLogs.create({
                data: {
                    method,
                    endpoint,
                    status,
                    user,
                    userId,
                    details,
                },
            });
        });
    }
    static getLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.prisma.adminLogs.findMany({
                orderBy: { createdAt: "desc" },
            });
        });
    }
}
exports.AdminLogRepository = AdminLogRepository;
