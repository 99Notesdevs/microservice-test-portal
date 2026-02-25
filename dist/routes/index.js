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
const express_1 = require("express");
const questions_1 = __importDefault(require("./questions"));
const categories_1 = __importDefault(require("./categories"));
const testSeries_1 = __importDefault(require("./testSeries"));
const test_1 = __importDefault(require("./test"));
const premiumUser_1 = __importDefault(require("./premiumUser"));
const ratingCategory_1 = __importDefault(require("./ratingCategory"));
const userProgress_1 = __importDefault(require("./userProgress"));
const progressConstraints_1 = __importDefault(require("./progressConstraints"));
const calendar_1 = __importDefault(require("./calendar"));
const adminMessage_1 = __importDefault(require("./adminMessage"));
const router = (0, express_1.Router)();
router.get("/healthCheck", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        message: "Welcome to test portal micorservice",
        status: 200,
    });
}));
router.use('/questions', questions_1.default);
router.use('/categories', categories_1.default);
router.use('/testSeries', testSeries_1.default);
router.use('/test', test_1.default);
router.use('/user', premiumUser_1.default);
router.use('/ratingCategory', ratingCategory_1.default);
router.use('/progress', userProgress_1.default);
router.use('/progressConstraints', progressConstraints_1.default);
router.use('/calendar', calendar_1.default);
router.use('/admin-messages', adminMessage_1.default);
exports.default = router;
