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
exports.googleLoginConfirmationMail = exports.calculateSentEmail = exports.sendVerificationMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const globalModels_js_1 = require("../shared/globalModels.js");
const index_js_1 = __importDefault(require("../config/index.js"));
function calculateSentEmail() {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const d = new Date();
    const day = String(d.getDate());
    const month = months[d.getMonth()];
    const year = String(d.getFullYear());
    return { day, month, year };
}
exports.calculateSentEmail = calculateSentEmail;
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    tls: {
        rejectUnauthorized: false,
    },
    auth: {
        user: 'support@taskplanet.org',
        pass: 'ccqnwcapvpaddaty',
    },
});
const sendVerificationMail = (res, user) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: 'admin@taskplanet',
        to: user === null || user === void 0 ? void 0 : user.email,
        subject: 'Verify Your Email',
        html: `<div style="width: 100%; padding: 20px 10px; font-weight: 600">
    <div style="width: 100%">
      <p style="width: 100%; text-align: center">
        Thank you to joining on Taskplanet. Please use the link below to
        verify your email.
      </p>
      <p style="width: 100%; text-align: center; margin-top: 30px">
        <a
          href="${index_js_1.default.frontend_BASE_URL}/login/${user === null || user === void 0 ? void 0 : user.token}"
          style="
            padding: 12px 8px;
            background-color: #348edb;
            color: #ffff;
            cursor: pointer;
            text-decoration: none;
          "
          >Verify Email</a
        >
      </p>
    </div>
    <p>Regards,</p>
    <a target="_blank" href="https://www.taskplanet.org/">Taskplanet</a>
  </div>`,
    };
    try {
        const d = calculateSentEmail();
        const info = yield transporter.sendMail(mailOptions);
        if (info) {
            yield globalModels_js_1.SentEmail.findOneAndUpdate({ day: d.day, month: d.month, year: d.year }, { $inc: { count: 1 } }, { upsert: true });
        }
    }
    catch (error) {
        // console.log(error);
    }
});
exports.sendVerificationMail = sendVerificationMail;
const googleLoginConfirmationMail = (user, password) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: 'admin@taskplanet',
        to: user === null || user === void 0 ? void 0 : user.email,
        subject: 'Confirmation Email',
        html: `<div">
        <h1 style="text-align: center;">Welcome to <a target="_blank" href="https://www.taskplanet.org/">Taskplanet</a></h1>
        <div  style="padding: 0 60px; width: 100%;">
              <h2>Hello! ${user.first_name} ${user.last_name},</h2>
              <p style="text-align: left;  margin-left: 20px">Here is you account information - </p>
                  <p style="text-align: left; margin-left: 40px">Full Name: ${user.first_name} ${user.last_name}</p>
                  <p style="text-align: left; margin-left: 40px">user ID: ${user.username}</p>
                  <p style="text-align: left; margin-left: 40px">Random Generated Password: ${password}</p>
                  <p style="text-align: left; margin-left: 40px">Email: ${user.email}</p>
        </div>
        <p>Regards,</p>
        <a target="_blank" href="https://www.taskplanet.org/">Taskplanet</a>
    </div>`,
    };
    try {
        const d = calculateSentEmail();
        const info = yield transporter.sendMail(mailOptions);
        if (info) {
            yield globalModels_js_1.SentEmail.findOneAndUpdate({ day: d.day, month: d.month, year: d.year }, { $inc: { count: 1 } }, { upsert: true });
        }
    }
    catch (error) {
        // console.log(error);
    }
});
exports.googleLoginConfirmationMail = googleLoginConfirmationMail;
