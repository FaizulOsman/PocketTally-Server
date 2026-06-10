"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.logger = void 0;
const winston_1 = __importStar(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const path_1 = __importDefault(require("path"));
const { combine, timestamp, label, printf } = winston_1.format;
// Custom Log Format
const myFormat = printf(({ level, message, label, timestamp }) => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return `${`[${date.toDateString()} ${hour}:${minute}:${second}]`} [${label}] ${level}: ${message}`;
});
// Create a logger for general information logs
const logger = winston_1.default.createLogger({
    level: 'info',
    format: combine(label({ label: 'COW-HUT' }), timestamp(), myFormat),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston_1.default.transports.Console(), // to show status in console
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(process.cwd(), 'logs', 'winston', 'success', 'CH-%DATE%-success.log'), // Specify the file path for success logs
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '10d',
        }),
    ],
});
exports.logger = logger;
// Create a logger specifically for error logs
const errorLogger = winston_1.default.createLogger({
    level: 'error',
    format: combine(label({ label: 'COW-HUT' }), timestamp(), myFormat),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston_1.default.transports.Console(), // to show status in console
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(process.cwd(), 'logs', 'winston', 'error', 'CH-%DATE%-error.log'), // Specify the file path for error logs
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '10d',
        }),
    ],
});
exports.errorLogger = errorLogger;
