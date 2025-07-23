import { CreateSmartboxDto } from "@/Dtos/CreateSmartboxDto";
import { SmartboxService } from "./Smartbox.service";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { GetSmartboxDto } from "@/Dtos/GetSmartboxDto";
import { UpdateSmartboxDto } from "@/Dtos/updateSmartboxDto";

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

    async getAllSmartB (res:Response){
        try{
            const getAll = await this.smartService.getAllSmartboxes()
            return res.status(200).json({message:"Tüm smartbox noktaları: ",
                smartboxes: getAll})
        }catch(error:any){
            if(error.message==="SMARTBOX_NOT_FOUND"){
                return res.status(404).json({message:"Hiç smartbox bulunamadı. "})
            }

            return res.status(500).json({message:"Sunucu hatası."})
        }
    }

    async getSmtBox (req:Request,res:Response){
        const dto = plainToInstance(GetSmartboxDto, {smartboxId: Number(req.params.smartboxId)})
        const errors = await validate(dto);

        if(errors.length>0){
            return res.status(409).json({message:"Geçersiz istek", errors})
        }

        try{
            const getSmrt = await this.smartService.getSmartbox(dto.smartboxId)
            return res.status(200).json({message:"Smartbox: ", smartbox: getSmrt})
        }catch(error:any){
            if(error.message==="SMTBX_NOT_FOUND"){
                return res.status(404).json({message:"SmartBox bulunamadı."})
            }

            return res.status(500).json({message:"Sunucu hatası"})
        }

    }

    async updateSmartBx(req:Request, res:Response){
        const dto = plainToInstance(UpdateSmartboxDto, {smartboxId: Number(req.params.smartboxId),
            location: req.body.location,
            capacity: req.body.capacity,
        });

        const errors = await validate(dto);

        if(errors.length>0){
            return res.status(409).json({message:"Geçersiz veri girişi. ", errors})
        }

        try{
            const updateSmt = await this.smartService.updateSmartbox(dto.smartboxId, dto.location, dto.capacity);
            return res.status(200).json({message:"Smartbox güncellendi.", 
                smartbox: updateSmt
            })
        }catch(error:any){
            if(error.message==="SMTBXNT"){
                return res.status(404).json({message:"Smartbox bulunamadı."})
            }

            return res.status(500).json({message:"Sunucu hatası."})
        }
    }

    async deleteSmart(req:Request, res:Response){
        const dto = plainToInstance(GetSmartboxDto, {smartboxId: Number(req.params.smartboxId)});
        const errors = await validate(dto);
        if(errors.length>0){
            return res.status(409).json({message:"Geçersiz veri girişi. ", errors})
        }

        try{
            await this.smartService.deleteSmartBox(dto.smartboxId);
            return res.status(200).json({message:"SmartBox silindi. "})
        }catch(error:any){
            console.error(error);
            if(error.message==="SMTBXNF"){
                return res.status(404).json({message:"SmartBox bulunamadı."})
            }

            return res.status(500).json({message:"Sunucu hatası"})
        }


    }


}