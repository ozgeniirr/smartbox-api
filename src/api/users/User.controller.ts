import { Request, Response } from "express";
import { UserService } from "./User.service";
import { BaseError } from "@/errors/BaseErrors";

export class UserController{
    private userService = new UserService();

    async getAllUsers(req: Request, res:Response){

        try{
            const getUSers = await this.userService.getAllUsers();
            return res.status(200).json({message:"Tüm müşteriler: ", getUSers});

        }catch(error:any){
            if (error instanceof BaseError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({message:"Sunucu hatası."})
        }

    }


    async getProfileMe(req:Request, res:Response){

        const userId = (req as any).user!.userId;

        try{
            const getMe = await this.userService.getProfile(userId)
            return res.status(200).json({message:"Profiliniz: ", getMe})

        }catch(error:any){
            if (error instanceof BaseError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({message:"Sunucu hatası."})
        }

    }
}