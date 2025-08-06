import redisClient from '@/config/redis';
import nodemailer, { Transporter } from 'nodemailer';
import { AppDataSource } from '../../config/data-source'
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { User } from '@/entities/User';
import { EmailNotMatchError } from '@/errors/OTP/EmailNotMAtchError';

export class OtpEmailService {
  private userRepo = AppDataSource.getRepository(User);
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;


  constructor() {
    const transportOptions: SMTPTransport.Options = {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };

    this.transporter = nodemailer.createTransport(transportOptions);
  }


  async sendOtpEmail(to:string ){
    const pendingEmail = await redisClient.get(`pending-email:${to}`);
    if(!pendingEmail || pendingEmail !== to){
      throw new EmailNotMatchError()
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    await redisClient.set(`otp:${to}`, otp, 'EX', 300);
    const info = await this.transporter.sendMail({
        from: `"SmartBox" <${process.env.EMAIL_USER}>`,
        to,
        subject:`Doğrulama kodunuz` ,
        text:`Otp kodunuz: ${otp}`,
    })
    console.log("📨 Email gönderildi:", info.messageId);
    console.log("🔗 Önizleme bağlantısı:", nodemailer.getTestMessageUrl(info));
  }




}