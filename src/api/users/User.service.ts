import { AppDataSource } from "@/config/data-source";
import { User } from "@/entities/User";
import { UserNotFound } from "@/errors/Users/UserNotFoundError";
import { getPagination, getPaginationMeta } from "@/utils/paginaiton";

export class UserService{
    private userRepositories = AppDataSource.getRepository(User);

    async getAllUsers (page:number, limit:number){
        const {skip, take, currentPage} = getPagination(page, limit,);
        const [users, total] = await this.userRepositories.findAndCount({
            where: { isVerified: true },
            order: { id: "ASC" }, 
            skip: skip,
            take: take,
            select: ['id', 'email', 'packages', 'role'   ]
        });
        return {
            data: users,
            ...getPaginationMeta(total, currentPage, limit)};
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