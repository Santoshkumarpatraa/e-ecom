const nodemailer = require("nodemailer");

module.exports = {
  sendMail: async (email, subject, template) => {
    try {
      const transporter = nodemailer.createTransport({
        // host: "smtp.forwardemail.net",
        // port: 465,
        // secure: true,
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"e-ecom 🛒" <santoshkumarpatraa@gmail.com>', // sender address
        to: email,
        cc: process.env.EMAIL_USERNAME,
        subject: subject, //"Hello ✔",
        //text: "Hello from e-ecom", // plain text body
        html: template, //`Hi ${name} your OTP is - <b>${encodedOtp}</b>`, // html body
      });

      console.log("Message sent: ✔ %s", email);
      //console.log("Message sent: %s", info.messageId);
    } catch (exception) {
      console.log("Mail Exception:- ",exception);
    }
  },
};
