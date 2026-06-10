"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Function to send the API response
const sendResponse = (res, data) => {
    const responseData = {
        statusCode: data === null || data === void 0 ? void 0 : data.statusCode, // Assign the status code from the data object
        success: data === null || data === void 0 ? void 0 : data.success, // Assign the success flag from the data object
        message: data === null || data === void 0 ? void 0 : data.message, // Assign the message from the data object
        meta: (data === null || data === void 0 ? void 0 : data.meta) || null || undefined, // Assign the meta data from the data object
        data: (data === null || data === void 0 ? void 0 : data.data) || null || undefined, // Assign the data from the data object or null if it's undefined
    };
    res.status(data === null || data === void 0 ? void 0 : data.statusCode).json(responseData); // Set the response status code and send the JSON response
};
exports.default = sendResponse;
