import { Request, Response } from "express";
import { AuthService } from "./Auth.service";
import { RegisterDto } from "@/validators/AuthDto"
import { LoginDto } from "@/validators/AuthDto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

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
        .json({ message: "Kayıt başarılı.", user: safeUser });
    } catch (error: any) {
      if (error.message === "EMAIL_EXIST") {
        return res
          .status(409)
          .json({ message: "Bu email zaten kayıtlı." });
      }

      return res.status(500).json({ message: "Sunucu hatası." });
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
      const { id, role, token } = lUser;

      return res.status(200).json({
        message: "Giriş yapıldı.",
        user: { id, email, role, token },
      });
    } catch (error: any) {
      if (error.message === "NO_USER") {
        return res.status(404).json({ message: "Kullanıcı bulunamadı" });
      } else if (error.message === "INVALID_PASSWORD") {
        return res.status(401).json({ message: "Yanlış şifre." });
      }

      return res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  profile(req: Request, res: Response) {
    try {
      const { email, userId, role } = req as any;

      return res.status(200).json({
        message: "Profil bilgisi",
        user: {
          email,
          id: userId,
          role,
        },
      });
    } catch (error: any) {
      return res.status(500).json({ message: "Sunucu hatası" });
    }
  }
}
