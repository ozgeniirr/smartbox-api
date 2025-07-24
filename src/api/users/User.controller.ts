import { Request, Response } from "express";
import { UserService } from "./User.service";
import { AppDataSource } from "@/config/data-source";


export class UserController{
    private userService = new UserService();

    async getAllUsers(req:Request, res:Response){

        try{
            const getUSers = await this.userService.getAllUsers();
            return res.status(200).json({message:"Tüm müşteriler: ", getUSers});

        }catch(error:any){
            if(error.message==="USER_NOT_FOUND"){
                return res.status(404).json({message:"Kullanıcı bulunamadı."})
            }

            return res.status(500).json({message:"Sunucu hatası."})
        }

    }

}