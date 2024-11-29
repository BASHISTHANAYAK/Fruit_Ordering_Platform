import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Using the environment variable
    pass: process.env.EMAIL_PASS, // Using the app password from environment variable
  },
});

async function sendEmail(to, subject, text, html) {
  try {
    console.log("Sending email...");
    console.log("To: ", to);
    console.log("Subject: ", subject);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // Using the environment variable for the sender's email
      to: to,
      subject: subject,
      text: text,
      html: html,
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Email sending failed");
  }
}

export { sendEmail };
