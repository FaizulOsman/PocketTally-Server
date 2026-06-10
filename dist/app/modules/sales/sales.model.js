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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesDaily = exports.SalesMonthly = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SalesMonthlySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    monthId: {
        type: String,
        required: true,
    },
    monthLabel: {
        type: String,
        required: true,
    },
    totalAmount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// Compound index to ensure unique monthId per user
SalesMonthlySchema.index({ user: 1, monthId: 1 }, { unique: true });
const SalesDailySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    monthId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.SalesMonthly = (0, mongoose_1.model)('SalesMonthly', SalesMonthlySchema);
exports.SalesDaily = (0, mongoose_1.model)('SalesDaily', SalesDailySchema);
