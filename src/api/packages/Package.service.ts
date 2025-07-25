import { AppDataSource } from "@/config/data-source";
import { Package } from "@/entities/Package";
import { SmartBox } from "@/entities/SmartBox";
import { User } from "@/entities/User";
import { PackageAlreadyPickedError } from "@/errors/Package/PackageAlreadyPickedError";
import { PackageNotFoundError } from "@/errors/Package/PackageNotFoundError";
import { PackageUnauthorizedError } from "@/errors/Package/PackageUnauthorizedError";
import { SmartBoxFullError } from "@/errors/SmartBox/SmartBoxFullError";
import { SmartBoxNotAvailable } from "@/errors/SmartBox/SmartBoxNotAvailable";
import { SmartboxNotFoundError } from "@/errors/SmartBox/SmartboxNotFoundError";
import { UserNotFound } from "@/errors/Users/UserNotFoundError";
import { v4 as uuidv4 } from "uuid";

export class PackageService {
    private userRepository = AppDataSource.getRepository(User);
    private packageRepository = AppDataSource.getRepository(Package);
    private smartboxRepository = AppDataSource.getRepository(SmartBox);

    async createPackage(userId:number, smartboxId:number, receiver: string, content:string, ){
        const user = await this.userRepository.findOneBy({id:userId});
        if(!user){
            throw new UserNotFound();
        }        
        const smartbox = await this.smartboxRepository.findOneBy({id: smartboxId})        
        if (!smartbox) {
            throw new SmartboxNotFoundError();
        }

        if(smartbox?.isActive===false){
            throw new SmartBoxNotAvailable();
        }

        const currentPackageCount = await this.packageRepository.count({
            where:{smartBox: {id: smartboxId}, isPickedUp: false},
        });

        if (currentPackageCount >= smartbox.capacity){
            throw new SmartBoxFullError();
        }

        smartbox.currentLoad = currentPackageCount + 1;
        await this.smartboxRepository.save(smartbox);


        const code = uuidv4(); 

        const package1 = await this.packageRepository.create({
            receiver,
            content,
            user:user,
            smartBox:smartbox,
            qrCode: code

        });
        return await this.packageRepository.save(package1)
        
    }

    async deletePackage(packageId:number, ){
        const pack = await this.packageRepository.findOne({
            where:{id:packageId},
            relations:["smartBox"]
        
        });
        if(!pack){
            throw new PackageNotFoundError();
        }
        
        if (pack.smartBox.currentLoad>0){
            pack.smartBox.currentLoad -=1;
        }
        await this.smartboxRepository.save(pack.smartBox);
        await this.packageRepository.remove(pack);

        return {message:"Başarıyla silindi."}
    }


    async pickPackage(packageId:number, currentUserId:number){
        const package3 = await this.packageRepository.findOne({where: {
            id: packageId},
            relations:["user", "smartBox"]
        });

        if(!package3){
            throw new PackageNotFoundError();
        }else if(package3.isPickedUp===true){
            throw new PackageAlreadyPickedError();
        }else if(package3.user.id!==currentUserId){
            throw new PackageUnauthorizedError();
        }
        package3.isPickedUp = true;
        package3.smartBox.currentLoad = Math.max(0, package3.smartBox.currentLoad - 1);
        await this.smartboxRepository.save(package3.smartBox);


        return await this.packageRepository.save(package3);
    
    }

    async getUserPackage(userId:number){
        const userPackage = await this.packageRepository.find({
            where: {
                user: {
                    id: userId
                }
            },
            relations: ["smartBox"],
            order: {
                createdAt:"DESC"
            }
        });

        return userPackage;
    }


    async getUsersPackageQr( userId:number){
        const userPackage = await this.packageRepository.find({
            where: {
                user:{
                    id:userId,
                    
                },
                isPickedUp: false,
            },
            select:[ 'qrCode', 'content', 'createdAt']
        });

        if(userPackage.length===0){
            throw new PackageNotFoundError();
        }

        return userPackage;
    }

    
}