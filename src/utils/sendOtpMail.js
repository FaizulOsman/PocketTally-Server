import nodemailer from 'nodemailer';

const sendOtpMail = (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    port: 587,
    secure: false,
    auth: {
      user: 'faizulosmanrabby@gmail.com',
      pass: 'ccqnwcapvpaddaty',
    },
  });
  console.log(otp);
  let mailOption = {
    from: 'PocketTally',
    to: email,
    subject: 'OTP Code',
    html: ` <div style="width: 640px; height: fit-content; margin-left: 50px; position: relative;">
   
          <div style="width: 100% ; height: 100; ">
          </div>
        <p>Here is your OTP code: ${otp}</p>
        <br />
        <p>Regards,</p>
        <p>PocketTally</p>
    </div>`,
  };

  transporter.sendMail(mailOption, async (error, info) => {
    if (error) {
      console.log('hello Error', error);
    } else {
      console.log(info);
    }
  });
};

export { sendOtpMail };
