// import { text } from "body-parser";
import nodemailer from "nodemailer";

const sendEmail = async (option) => {
  // create trnsporter
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  console.log("transport:", transport);

  const emailOptions = {
    from: "Cineflix support<support@cineflix.com>",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  console.log("emailoptions:", emailOptions);
  try {
    await transport.sendMail(emailOptions);
  } catch (error) {
    console.error(error);
  }
};

export default sendEmail;
