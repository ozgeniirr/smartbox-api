import { plainToInstance } from "class-transformer";
import { OtpEmailService } from "./Email.service"
import { Request, Response } from "express";
import { SendEmailDto } from "@/Dtos/IsEmailDto";
import { validate } from "class-validator";
import redisClient from "@/config/redis";
import { BaseError } from "@/errors/BaseErrors";


export class OtpEmailController {
    private otpEmailService = new OtpEmailService()

    async sendEmail(req:Request, res:Response){
        const dto = plainToInstance(SendEmailDto, req.body);
        const errors =  await validate(dto);

        if(errors.length>0){
            return res.status(400).json({message: "Lütfen geçerli bir mail adresi giriniz. "})

        }
        try{
            const email = dto.to;
            const otp = Math.floor(100000 + Math.random() * 900000);
            await redisClient.set(`otp:${dto.to}`, otp, `EX`, 300);

            await this.otpEmailService.sendOtpEmail(email);
            return res.status(200).json({message:"Doğrulama kodu gönderilmiştir. "})


        }catch(error:any){
            if (error instanceof BaseError) {
                return res.status(error.statusCode).json({ message: error.message })
            }
              
            console.error("Email gönderim hatası:", error);
            return res.status(500).json({message:"Sunucu hatası."})
        }

    }
}