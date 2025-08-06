import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth:{
    user: process.env.USER_MAIL_AUTH,
    pass: process.env.USER_MAIL_PASSWORD,
  },
});


