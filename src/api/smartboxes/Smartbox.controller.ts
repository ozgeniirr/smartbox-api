import { CreateSmartboxDto } from "@/Dtos/CreateSmartboxDto";
import { SmartboxService } from "./Smartbox.service";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";

export class SmartboxController {
    private smartService = new SmartboxService();

    async create( req:Request, res:Response){
        const smartDto= plainToInstance(CreateSmartboxDto, req.body);
        const errors = await validate(smartDto);

        if(errors.length>0){
            return res.status(400).json({message:"Geçerli bir içerik giriniz."})
        }

        const userId = (req as any).user!.id;
        const {location, isActive, capacity} = smartDto;
        try{
            const smartBox = await this.smartService.createSmartbox(userId, location, isActive, capacity);
            return res.status(201).json({message:"SmartBox oluşturuldu ", smartBox});
        }catch(error:any ){
            if(error.message==="USER_NOT_FOUND"){
                return res.status(404).json({message:"Kullanıcı bulunamadı."})
            }

            return res.status(500).json({message:"Sunucu hatası."})
        }

    }


}