"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormData = void 0;
const mongoose_1 = require("mongoose");
// FormData Schema
const FormDataSchema = new mongoose_1.Schema({
    formId: {
        type: String,
        required: true,
    },
    data: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.FormData = (0, mongoose_1.model)('FormData', FormDataSchema);
