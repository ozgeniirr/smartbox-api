import { AppDataSource } from "@/config/data-source";
import { User } from "@/entities/User";

export class UserService{
    private userRepositories = AppDataSource.getRepository(User);

    async getAllUsers (){
        const user = await this.userRepositories.find({
            select: ['id', 'email', 'packages', 'role'   ]
        });
        if(!user){
            throw new Error("USER_NOT_FOUND");

        }

        return user;
    }
}