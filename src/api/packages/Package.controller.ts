import { plainToInstance } from "class-transformer";
import { PackageService } from "./Package.service";
import { Request, Response } from "express";
import { CreatePackageDto } from "@/Dtos/CreatePackageDto";
import { validate } from "class-validator";
import { BaseError } from "@/errors/BaseErrors";



export class PackageController{
    private packageService = new PackageService();


    async createPack ( req:Request, res:Response){
        const { userId } = req.params;
        const dto = plainToInstance(CreatePackageDto, req.body)
        const errors = await validate(dto);

        if(errors.length>0){
            return res.status(400).json({message:"Lütfen geçerli veri girişi yapınız."})
        }
        try {
            const numericUserId = parseInt(userId);
            const cPackage = await this.packageService.createPackage(
                numericUserId,
                dto.smartboxId,
                dto.receiver,
                dto.content
            );
            return res.status(201).json({
                message: "Paket oluşturuldu.",
                cPackage: {
                    id: cPackage.id,
                    receiver: cPackage.receiver,
                    content: cPackage.content,
                    qrCode: cPackage.qrCode,
                    isPickedUp: cPackage.isPickedUp,
                    createdAt: cPackage.createdAt,
                    smartBox: {
                        id: cPackage.smartBox.id,
                        location: cPackage.smartBox.location,
                        currentLoad: cPackage.smartBox.currentLoad
                    },
                    user: {
                        id: cPackage.user.id,
                        email: cPackage.user.email
                    }
                }
            });
        }catch(error:any){
            console.error(error);
            if (error instanceof BaseError) {
                return res.status(error.statusCode).json({ message: error.message });
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
            } catch (error: any) {
                if (error instanceof BaseError) {
                    return res.status(error.statusCode).json({ message: error.message });
                }
                return res.status(500).json({ message: "Sunucu hatası." });
            }
        }


        async pickPack( req:Request, res:Response){
            const packageId = Number(req.params.packageId);
            if(!packageId){
                return res.status(400).json({message:"Lütfen paketinizin idsini giriniz."});
            }

            const qrCodeFrBody = req.body.qrCode;

            try{
                const picking = await this.packageService.pickPackage(packageId, qrCodeFrBody);
                const { password: _, ...safeUser } = picking.user;
                const safePicking = {...picking, user: safeUser,};
                return res.status(200).json({message:"Paketiniz başarıyla alındı", safePicking});
                
            }catch(error:any){
                if (error instanceof BaseError) {
                    return res.status(error.statusCode).json({ message: error.message });
                }
                return res.status(500).json({message:"Sunucu hatası."})
            }

        }

        async getUserPack( req:Request, res:Response){
            const userId = (req as any).user!.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 5;
            try {
                const getUserP = await this.packageService.getUserPackage(userId, page, limit);
                return res.status(200).json({message:"Paketleriniz ",
                    packages: getUserP});
            }catch(error:any){
                return res.status(500).json({message:"Sunucu hatası."})
            }
        }

        async getUserPacksQr(req:Request, res:Response){
            const userId = (req as any).user!.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 5;
            try{
                const getUPQr = await this.packageService.getUsersPackageQr(userId, page, limit);
                return res.status(200).json({message:"Paketlerin Qr kodları: ", 
                    packageQr: getUPQr
                });
            }catch(error:any){
                if (error instanceof BaseError) {
                    return res.status(error.statusCode).json({ message: error.message });
                }

                return res.status(500).json({message:"Sunucu hatası"})
            }
        }
    
    }