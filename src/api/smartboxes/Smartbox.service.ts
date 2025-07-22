import { AppDataSource } from "@/config/data-source";
import { SmartBox } from "@/entities/SmartBox";
import { User } from "@/entities/User";

export class SmartboxService {
    private userRepo = AppDataSource.getRepository(User);
    private smartboxRepo = AppDataSource.getRepository(SmartBox);

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

}