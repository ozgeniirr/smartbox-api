import { AppDataSource } from '../../config/data-source';
import { User } from "@/entities/User";
import { UserEmailExistsError } from "@/errors/Users/UserEmailExistsError";
import { generateToken } from "@/utils/jwt";
import bcrypt from 'bcryptjs';
import { UserNotFound } from "@/errors/Users/UserNotFoundError";
import { InvalidPassword } from "@/errors/Users/InvalidPasswordError";
import { OtpEmailService } from "../email/Email.service";
import redisClient from "@/config/redis";
import { OtpMismatchError } from "@/errors/OTP/OtpMismatchError";
import { EmailNotVerifiedError } from "@/errors/OTP/EmailNotVerifiedError";
import { generateVerificationEmailHtml } from "@/templates/verificationEmail";
import { generateVerificationToken } from "@/utils/emailJwt";
import { transporter } from "@/config/nodeMailerConfig";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';


export class AuthService {
    private userRepository = AppDataSource.getRepository(User);
    private otpEmailService = new OtpEmailService();

    async register(email:string, password: string){
        const existingUser = await this.userRepository.findOneBy({email});

        if(existingUser){
            throw new UserEmailExistsError();
        }
        const hashedPassword = await bcrypt.hash( password, 10);

        const user = this.userRepository.create({
            email,
            password: hashedPassword
        });

        await redisClient.set(`pending-email:${email}`, email, `EX`, 300);
        
        await this.userRepository.save(user);
        await this.otpEmailService.sendOtpEmail(user.email)

        return user;
    }

    async verifyOtp(email:string, otp:string){
        const user = await this.userRepository.findOneBy({email});
        if(!user){
            throw new UserNotFound();
        }

       const dOtp = await redisClient.get(`otp:${email}`);

        if(otp!== dOtp){
            throw new OtpMismatchError();
        }

        user.isVerified = true;
        await this.userRepository.save(user);
        await redisClient.del(`otp:${email}`);
        return user;

    }


    async login ( email:string, password:string){
        const user = await this.userRepository.findOneBy({email});
        if(!user){
            throw new UserNotFound();
        }

        if(!user.isVerified){
            throw new EmailNotVerifiedError();
        }

         const isPass = await bcrypt.compare(password, user.password)
        if(!isPass){
            throw new InvalidPassword();
        }

        const token = generateToken(user.id, user.email, user.role );

        return {email: user.email,
            id: user.id,
            role:user.role,
            token: token
        };
    }

}

    /* async register(email:string, password: string){
        const existingUser = await this.userRepository.findOneBy({email});

        if(existingUser){
            throw new UserEmailExistsError();
        }
        const hashedPassword = await bcrypt.hash( password, 10);

        const user = this.userRepository.create({
            email,
            password: hashedPassword
        });
        
        await this.userRepository.save(user);
        const token = generateVerificationToken(user.id, user.email);
        const verifyUrl = `http://localhost:3000/api/auth/verify-email/${token}`;
        console.log("Link:", verifyUrl);

        const html = generateVerificationEmailHtml(user.email, verifyUrl)
        const info = await transporter.sendMail(
            {to: user.email,
                subject: "E-posta Doğrulama",
                html,
            }
        );
        console.log("✅ Mail gönderildi:", info.messageId);
        console.log("📬 Ön izleme (Ethereal kullanıyorsan):", nodemailer.getTestMessageUrl(info));
        return user;
    
    }
    async verifyEmail(token: string) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; email: string };
            const user = await this.userRepository.findOneBy({ id: decoded.userId });
            if (!user) {
                throw new UserNotFound();
            }
            if (user.isVerified) {
                throw new Error("Kullanıcı zaten doğrulanmış.");
            }
            user.isVerified = true;
            await this.userRepository.save(user);
            return { message: "E-posta başarıyla doğrulandı." };
        } catch (error: any) {
            if (error.name === "TokenExpiredError") {
                throw new Error("Doğrulama bağlantısı süresi dolmuş.");
            }
            throw new Error("Geçersiz doğrulama bağlantısı.");
        }
    }


*/