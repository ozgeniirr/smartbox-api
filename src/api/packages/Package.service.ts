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

        smartbox.currentLoad = currentPackageCount + 1;
        await this.smartboxRepository.save(smartbox);


        const code = uuidv4(); 

        const package1 = await this.packageRepository.create({
            sender,
            content,
            user:user,
            smartBox:smartbox,
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


    async pickPackage(packageId:number, currentUserId:number){
        const package3 = await this.packageRepository.findOne({where: {
            id: packageId},
            relations:["user", "smartBox"]
        });

        if(!package3){
            throw new Error("PACKAGE_NOT_FOUND")
        }else if(package3.isPickedUp===true){
            throw new Error("PACKAGE_ALREADY_PICKED")

        }else if(package3.user.id!==currentUserId){
            throw new Error("UNAUTHORIZED_PACKAGE_ACCESS")
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

    
}