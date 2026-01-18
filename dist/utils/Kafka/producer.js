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
exports.sendMessage = exports.kafka = void 0;
const logger_1 = __importDefault(require("../logger"));
const kafkajs_1 = require("kafkajs");
exports.kafka = new kafkajs_1.Kafka({
    clientId: 'my-test-portal',
    brokers: ['kafka:9092'],
});
const producer = exports.kafka.producer();
const sendMessage = (topic, message) => __awaiter(void 0, void 0, void 0, function* () {
    yield producer.connect();
    logger_1.default.info(`Sending message to topic ${topic}: ${JSON.stringify(message)}`);
    yield producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
    });
    yield producer.disconnect();
});
exports.sendMessage = sendMessage;
