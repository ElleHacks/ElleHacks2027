const nodemailer = require("nodemailer");

// Without SMTP settings (local development) emails are printed to the console
const transporter = process.env.SMTP_HOST
    ? nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD
          }
      })
    : null;

const sendMail = async ({ to, subject, text }) => {
    if (!transporter) {
        console.log(`📧 [dev email] To: ${to}\nSubject: ${subject}\n\n${text}\n`);
        return;
    }

    await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        text
    });
};

// Email failures should never break the request that triggered them
const sendMailSafely = async (message) => {
    try {
        await sendMail(message);
        return true;
    } catch (error) {
        console.error("❌ Failed to send email:", error.message);
        return false;
    }
};

module.exports = { sendMail, sendMailSafely };
