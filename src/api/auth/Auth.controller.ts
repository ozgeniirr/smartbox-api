import { Request, Response } from "express";
import { AuthService } from "./Auth.service";
import { RegisterDto, VerifyOtpDto } from "@/Dtos/AuthDto"
import { LoginDto } from "@/Dtos/AuthDto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { BaseError } from "@/errors/BaseErrors";

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response) {
    const dto = plainToInstance(RegisterDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Geçerli bir e-posta ve şifre giriniz.",
        errors,
      });
    }

    const { email, password } = dto;

    try {
      const user = await this.authService.register(email, password);
      const { password: _, ...safeUser } = user;
      return res
        .status(201)
        .json({ message: "Lütfen e-posta adresine gelen doğrulama kodunu giriniz. ", user: safeUser });
    } catch (error: any) {
      if (error instanceof BaseError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  async verifyOTP(req:Request, res:Response){
    const dto = plainToInstance(VerifyOtpDto, req.body)
    const errors = await validate(dto);
    if(errors.length>0){
      return res.status(400).json({message:"Lütfen geçerli veri girin. ", errors});
    }

    const {email, otp } = dto;

    try{
      await this.authService.verifyOtp(email, otp);
      return res.status(200).json({message:"Kod doğrulandı giriş yapabilirsiniz. "})
    }catch(error:any){
      if (error instanceof BaseError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({message:"Sunucu hatası"})

    }

  }

  async login(req: Request, res: Response) {
    const dto = plainToInstance(LoginDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Geçerli bir e-posta ve şifre giriniz.",
        errors,
      });
    }

    const { email, password } = dto;

    try {
      const lUser = await this.authService.login(email, password);
      console.log("✅ Login başarılı:", lUser); 

      const { id, role, token } = lUser;

      return res.status(200).json({
        message: "Giriş yapıldı.",
        user: { id, email, role, token },
      });
    } catch (error: any) {
      if (error instanceof BaseError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      
      console.error("Login Error:", error);

      return res.status(500).json({ message: "Sunucu hatası."})
    }
  }

}
