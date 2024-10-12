"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentEmail = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sentEmailSchema = new mongoose_1.default.Schema({
    sent_email_counter_id: {
        type: String,
        default: 'sent_email_counter',
    },
    day: String,
    month: String,
    year: String,
    count: Number,
});
const SentEmail = mongoose_1.default.model('SentEmail', sentEmailSchema);
exports.SentEmail = SentEmail;
