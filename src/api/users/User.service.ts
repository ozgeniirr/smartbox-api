import { AppDataSource } from "@/config/data-source";
import { User } from "@/entities/User";
import { UserNotFound } from "@/errors/Users/UserNotFoundError";

export class UserService{
    private userRepositories = AppDataSource.getRepository(User);

    async getAllUsers (){
        const user = await this.userRepositories.find({
            select: ['id', 'email', 'packages', 'role'   ]
        });
        if(!user){
            throw new UserNotFound();

        }
        return user;
    }



    async getProfile(userId:number){
        const profile = await this.userRepositories.findOne({where: {id:userId},
        select:[
            "id", 
            "email",
            "packages",
            "role"
        ]});
        if(!profile){
            throw new UserNotFound();
        }

        return profile;
    }

}