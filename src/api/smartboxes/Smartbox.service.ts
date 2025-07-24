import { AppDataSource } from "@/config/data-source";
import { Package } from "@/entities/Package";
import { SmartBox } from "@/entities/SmartBox";
import { User } from "@/entities/User";

export class SmartboxService {
    private userRepo = AppDataSource.getRepository(User);
    private smartboxRepo = AppDataSource.getRepository(SmartBox);
    private packageRepo = AppDataSource.getRepository(Package);

    async createSmartbox(userId:number, location: string, isActive:boolean, capacity:number){
        const user = await this.userRepo.findOneBy({id:userId});
        if(!user){
            throw new Error("USER_NOT_FOUND")
        }

        const smartbox1 = await this.smartboxRepo.create({
            location,
            isActive,
            capacity

        });

        return this.smartboxRepo.save(smartbox1);
    }

    async getAllSmartboxes(){
        const allSmartboxes = await this.smartboxRepo.find();
        if(allSmartboxes.length===0){
            throw new Error("SMARTBOX_NOT_FOUND")
        }

        return allSmartboxes;

    }


    async getSmartbox(smartBoxId:number){
        const smtbx = await this.smartboxRepo.findOneBy({id:smartBoxId});
        if(!smtbx){
            throw new Error("SMTBX_NOT_FOUND")
        }

        return smtbx;
    }

    async updateSmartbox(smartBoxId:number, location:string, capacity:number){
        const smrtbx = await this.smartboxRepo.findOneBy({id:smartBoxId});
        if(!smrtbx){
            throw new Error("SMTBXNT")
        }
        
        await this.smartboxRepo.update({
            id:smartBoxId
        },
        {location,
            capacity
        });
        const updatedsmrtbx = await this.smartboxRepo.findOneBy({id:smartBoxId});
        return updatedsmrtbx;

    }

    async deleteSmartBox(smartboxId:number){
        const SmartB = await this.smartboxRepo.findOneBy({id:smartboxId});
        if(!SmartB){
            throw new Error("SMTBXNF")
        }

        const activePackages = await this.packageRepo.find({
            where:{
                smartBox:{ id: smartboxId},
                isPickedUp: false, 
            },
        });
        if(activePackages.length>0){
            throw new Error("SMARTBOX_HAS_ACTIVE_PACKAGES")
        }

        const deleteSmt = await this.smartboxRepo.remove(SmartB)

        return deleteSmt;
    }

}