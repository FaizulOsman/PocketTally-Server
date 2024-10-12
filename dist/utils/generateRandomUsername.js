"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateRandomUsername(firstName, lastName) {
    // Generate a random number or string
    const randomSuffix = Math.random().toString(36).substring(2, 5);
    // Combine the first name, last name, and random suffix
    const username = (firstName + lastName).toLowerCase().replace(/\s+/g, '') + randomSuffix;
    return username;
}
exports.default = generateRandomUsername;
