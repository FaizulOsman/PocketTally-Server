"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBDTime = void 0;
const getBDTime = () => {
    const d = new Date();
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    const nd = new Date(utc + 3600000 * 6);
    // Get day, month, and year
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };
    const date = nd.toLocaleDateString('en-US', options);
    // Get time
    const time = nd.toLocaleTimeString('en-US');
    return { time, date: new Date(date).toDateString() };
};
exports.getBDTime = getBDTime;
