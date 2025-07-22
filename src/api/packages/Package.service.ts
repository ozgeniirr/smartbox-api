import { AppDataSource } from "@/config/data-source";
import { Package } from "@/entities/Package";
import { SmartBox } from "@/entities/SmartBox";
import { User } from "@/entities/User";
import { v4 as uuidv4 } from "uuid";

export class PackageService {
    private userRepository = AppDataSource.getRepository(User);
    private packageRepository = AppDataSource.getRepository(Package);
    private smartboxRepository = AppDataSource.getRepository(SmartBox);

    async createPackage(userId:number, smartboxId:number, sender: string, content:string){
        const user = await this.userRepository.findOneBy({id:userId});
        if(!user){
            throw new Error("USER_NOT_FOUND")
        }        
        const smartbox = await this.smartboxRepository.findOneBy({id: smartboxId})        
        if (!smartbox) {
            throw new Error("SMARTBOX_NOT_FOUND");
        }

        if(smartbox?.isActive===false){
            throw new Error("SMARTBOX_NOT_AVAILABLE")
        }

        const currentPackageCount = await this.packageRepository.count({
            where:{smartBox: {id: smartboxId}, isPickedUp: false},
        });

        if (currentPackageCount >= smartbox.capacity){
            throw new Error("SMARTBOX_FULL");
        }


        const code = uuidv4(); 

        const package1 = await this.packageRepository.create({
            sender,
            content,
            user:user,
            smartBox:{id:smartboxId},
            qrCode: code

        });
        return await this.packageRepository.save(package1)
        
    }

    async deletePackage(packageId:number){
        const pack = await this.packageRepository.findOneBy({id:packageId});
        if(!pack){
            throw new Error("PACKAGE_NOT_FOUND")
        }
        await this.packageRepository.remove(pack);

        return {message:"Başarıyla silindi."}
    }


    
}