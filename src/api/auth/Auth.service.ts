import { AppDataSource } from "@/config/data-source";
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

