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
exports.createConsumer = exports.kafka = void 0;
const logger_1 = __importDefault(require("../logger"));
const kafkajs_1 = require("kafkajs");
exports.kafka = new kafkajs_1.Kafka({
    clientId: 'my-test-portal',
    brokers: ['kafka:9092'],
});
const createConsumer = (groupId, topic, handler) => __awaiter(void 0, void 0, void 0, function* () {
    const consumer = exports.kafka.consumer({ groupId });
    yield consumer.connect();
    yield consumer.subscribe({ topic, fromBeginning: false });
    logger_1.default.info(`Consumer connected to topic ${topic} with group ID ${groupId}`);
    yield consumer.run({
        eachMessage: (_a) => __awaiter(void 0, [_a], void 0, function* ({ topic, partition, message }) {
            var _b, _c;
            logger_1.default.info(`Received message from topic ${topic}: ${(_b = message.value) === null || _b === void 0 ? void 0 : _b.toString()} on partition ${partition}`);
            const decoded = (_c = message.value) === null || _c === void 0 ? void 0 : _c.toString();
            if (decoded) {
                yield handler(JSON.parse(decoded));
            }
        }),
    });
});
exports.createConsumer = createConsumer;
