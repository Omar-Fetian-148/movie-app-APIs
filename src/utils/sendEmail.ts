import nodemailer from "nodemailer";
import hbs from 'nodemailer-express-handlebars';
import path from "path";
import { fileURLToPath } from 'url';
import { config } from "dotenv";
config()

export default async function sendEmail(to: string, OTP: string, OTPExpiryTime: number) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD
      },
    });

    let templateName = 'OTPTemp';
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const templatePath = path.resolve(__dirname, '../data/templates');

    transporter.use(
      'compile',
      hbs({
        viewPath: templatePath, // Use the absolute path to your template directory
        extName: '.hbs',
        viewEngine: {
          extname: '.hbs',
          partialsDir: templatePath,
          layoutsDir: templatePath,
          defaultLayout: `${templateName}.hbs`,
        },
      })
    );


    const mailOptions = {
      from: process.env.NODEMAILER_USERNAME,
      to,
      subject: "Verify Your Email",
      template: templateName,
      context: {
        ...(OTP && { otp: OTP }),
        ...(OTPExpiryTime && { expiryTime: OTPExpiryTime }),
      },
      headers: {
        priority: 'high',
      },
      dsn: {
        id: 'messageId',
        return: 'headers',
        notify: ['failure', 'delay'],
        recipient: process.env.NODEMAILER_USERNAME
      },
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred from send Email");
    }
  }
};