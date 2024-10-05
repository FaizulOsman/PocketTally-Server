import nodemailer from 'nodemailer';
import { SentEmail } from '../shared/globalModels.js';
import config from '../config/index.js';

type EmailUser = {
  email?: string;
  first_name: string;
  last_name: string;
  username: string;
  mobile: string;
  token?: string;
};

type MailOptions = {
  from: string;
  to: string | undefined;
  subject: string;
  html: string;
};

function calculateSentEmail(): { day: string; month: string; year: string } {
  const months: string[] = [
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
  const d: Date = new Date();
  const day = String(d.getDate());
  const month: string = months[d.getMonth()];
  const year = String(d.getFullYear());
  return { day, month, year };
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: 'support@taskplanet.org',
    pass: 'ccqnwcapvpaddaty',
  },
});

const sendVerificationMail = async (
  res: any,
  user: EmailUser
): Promise<void> => {
  const mailOptions: MailOptions = {
    from: 'admin@taskplanet',
    to: user?.email,
    subject: 'Verify Your Email',
    html: `<div style="width: 100%; padding: 20px 10px; font-weight: 600">
    <div style="width: 100%">
      <p style="width: 100%; text-align: center">
        Thank you to joining on Taskplanet. Please use the link below to
        verify your email.
      </p>
      <p style="width: 100%; text-align: center; margin-top: 30px">
        <a
          href="${config.frontend_BASE_URL}/login/${user?.token}"
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
    const d: { day: string; month: string; year: string } =
      calculateSentEmail();
    const info = await transporter.sendMail(mailOptions);
    if (info) {
      await SentEmail.findOneAndUpdate(
        { day: d.day, month: d.month, year: d.year },
        { $inc: { count: 1 } },
        { upsert: true }
      );
    }
  } catch (error) {
    // console.log(error);
  }
};

const googleLoginConfirmationMail = async (
  user: EmailUser,
  password: string
): Promise<void> => {
  const mailOptions: MailOptions = {
    from: 'admin@taskplanet',
    to: user?.email,
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
    const d: { day: string; month: string; year: string } =
      calculateSentEmail();
    const info = await transporter.sendMail(mailOptions);
    if (info) {
      await SentEmail.findOneAndUpdate(
        { day: d.day, month: d.month, year: d.year },
        { $inc: { count: 1 } },
        { upsert: true }
      );
    }
  } catch (error) {
    // console.log(error);
  }
};

export {
  sendVerificationMail,
  calculateSentEmail,
  googleLoginConfirmationMail,
};
