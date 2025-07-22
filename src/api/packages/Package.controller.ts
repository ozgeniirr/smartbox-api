import { plainToInstance } from "class-transformer";
import { PackageService } from "./Package.service";
import { Request, Response } from "express";
import { CreatePackageDto } from "@/Dtos/CreatePackageDto";
import { validate } from "class-validator";



export class PackageController{
    private packageService = new PackageService();


    async createPack ( req:Request, res:Response){
        const { senderId } = req.params;
        const dto = plainToInstance(CreatePackageDto, req.body)
        const errors = await validate(dto);

        if(errors.length>0){
            return res.status(400).json({message:"Lütfen geçerli veri girişi yapınız."})
        }
        try {
            const numericSenderId = parseInt(senderId);
            const cPackage = await this.packageService.createPackage(
                numericSenderId,
                dto.smartboxId,
                dto.sender,
                dto.content
            );
            return res.status(201).json({
                message: "Paket oluşturuldu.",
                cPackage: {
                    id: cPackage.id,
                    sender: cPackage.sender,
                    content: cPackage.content,
                    qrCode: cPackage.qrCode,
                    isPickedUp: cPackage.isPickedUp,
                    createdAt: cPackage.createdAt,
                    smartBox: {
                        id: cPackage.smartBox.id,
                        location: cPackage.smartBox.location
                    },
                    user: {
                        id: cPackage.user.id,
                        email: cPackage.user.email
                    }
                }
            });
        }catch(error:any){
            console.error(error);
            if(error.message==="SMARTBOX_NOT_FOUND"){
                return res.status(404).json({messsage:"Smarbox bulunamadı"})
            }else if(error.message==="SMARTBOX_NOT_AVAILABLE"){
                return res.status(403).json({message:"Smartbox uygun değil."})
            }else if(error.message==="SMARTBOX_FULL"){
                return res.status(400).json({message:"Smartbox dolu."})
            }else if(error.message==="USER_NOT_FOUND"){
                return res.status(404).json({message:"Kullanıcı bulunamadı."})
            }

            return res.status(500).json({message:"Sunucu hatası."})
            

        }
    
    
    }
    async deletePack(req: Request, res: Response) {
        const idRaw = req.params.packageId;
        const packageId = Number(idRaw);
        if (isNaN(packageId)) {
            return res.status(400).json({ message: "Geçersiz paket ID." });}
            try {
                const result = await this.packageService.deletePackage(packageId);
                return res.status(200).json(result);
            } catch (err: any) {
                if (err.message === "PACKAGE_NOT_FOUND") {
                    return res.status(404).json({ message: "Paket bulunamadı." });
                }
                return res.status(500).json({ message: "Sunucu hatası." });
            }
        }
    
    
    
    
    }