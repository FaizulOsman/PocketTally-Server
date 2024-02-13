"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Form = void 0;
const mongoose_1 = require("mongoose");
// Form Schema
const FormSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    formName: {
        type: String,
        required: true,
    },
    formData: {
        type: [
            {
                type: {
                    type: String,
                    required: true,
                },
                placeholder: {
                    type: String,
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                required: {
                    type: Boolean,
                    required: true,
                },
            },
        ],
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Form = (0, mongoose_1.model)('Form', FormSchema);
