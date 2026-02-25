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
exports.logRequest = logRequest;
const AdminLogRepository_1 = require("../repositories/AdminLogRepository");
function logRequest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (["POST", "PUT", "DELETE"].includes(req.method) &&
            req.authType !== "User") {
            const user = req.authType || null;
            const id = parseInt(req.authUser) || null;
            const details = Object.assign({}, req.body);
            if (req.originalUrl.includes("/login") ||
                req.originalUrl.includes("/signup") ||
                req.originalUrl.endsWith("/admin")) {
                if (req.body.password) {
                    details.password = "**hidden**";
                }
                if (req.body.secretKey) {
                    details.secretKey = "**hidden**";
                }
            }
            res.on("finish", () => __awaiter(this, void 0, void 0, function* () {
                yield AdminLogRepository_1.AdminLogRepository.createLog({
                    method: req.method,
                    endpoint: req.originalUrl,
                    status: res.statusCode < 400 ? "success" : "error",
                    user,
                    userId: id,
                    details: details ? JSON.stringify(details) : null,
                });
            }));
        }
        next();
    });
}
