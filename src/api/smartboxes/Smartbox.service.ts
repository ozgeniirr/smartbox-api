import { AppDataSource } from '../../config/data-source'
import { Package } from "@/entities/Package";
import { SmartBox } from "@/entities/SmartBox";
import { User } from "@/entities/User";
import { SmartBoxNotAvailable } from "@/errors/SmartBox/SmartBoxNotAvailable";
import { SmartboxNotFoundError } from "@/errors/SmartBox/SmartboxNotFoundError";
import { UserNotFound } from "@/errors/Users/UserNotFoundError";
import { getPagination, getPaginationMeta } from "@/utils/paginaiton";

export class SmartboxService {
    private userRepo = AppDataSource.getRepository(User);
    private smartboxRepo = AppDataSource.getRepository(SmartBox);
    private packageRepo = AppDataSource.getRepository(Package);

    async createSmartbox(userId:number, location: string, isActive:boolean, capacity:number){
        const user = await this.userRepo.findOneBy({id:userId});
        if(!user){
            throw new UserNotFound();
        }
        const smartbox1 = await this.smartboxRepo.create({
            location,
            isActive,
            capacity

        });

        return this.smartboxRepo.save(smartbox1);
    }

    async getAllSmartboxes(page:number, limit:number){
        const {skip, take, currentPage} = getPagination(page, limit,);
        const [smartBoxes, total] = await this.smartboxRepo.findAndCount({
            where: { isActive: true},
            order: {id: "ASC"},
            skip: skip,
            take:take,
            select: ["id", "location", "packages", "capacity", "currentLoad"]
        });
        if( smartBoxes.length===0){
            throw new SmartboxNotFoundError();
        }

        return{
            data:smartBoxes,
            ...getPaginationMeta(total, currentPage, limit)};

    }


    async getSmartbox(smartBoxId:number){
        const smtbx = await this.smartboxRepo.findOneBy({id:smartBoxId});
        if(!smtbx){
            throw new SmartboxNotFoundError();
        }

        return smtbx;
    }

    async updateSmartbox(smartBoxId:number, location:string, capacity:number){
        const smrtbx = await this.smartboxRepo.findOneBy({id:smartBoxId});
        if(!smrtbx){
            throw new SmartboxNotFoundError();
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
            throw new SmartboxNotFoundError();
        }

        const activePackages = await this.packageRepo.find({
            where:{
                smartBox:{ id: smartboxId},
                isPickedUp: false, 
            },
        });
        if(activePackages.length>0){
            throw new SmartBoxNotAvailable();
        }
        const deleteSmt = await this.smartboxRepo.remove(SmartB)

        return deleteSmt;
    }

}