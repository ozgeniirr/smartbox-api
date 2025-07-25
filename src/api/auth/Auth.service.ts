import { AppDataSource } from "@/config/data-source";
import { User } from "@/entities/User";
import { UserEmailExistsError } from "@/errors/Users/UserEmailExistsError";
import { generateToken } from "@/utils/jwt";
import bcrypt from 'bcryptjs';
import { BaseError } from "@/errors/BaseErrors";
import { UserNotFound } from "@/errors/Users/UserNotFoundError";
import { InvalidPassword } from "@/errors/Users/InvalidPasswordError";
        


export class AuthService {
    private userRepository = AppDataSource.getRepository(User);

    async register(email:string, password: string){
        const existingUser = await this.userRepository.findOneBy({email});

        if(existingUser){
            throw new UserEmailExistsError();
        }
        const hashedPassword = await bcrypt.hash( password, 10);

        const user = this.userRepository.create({
            email,
            password: hashedPassword
        });


        await this.userRepository.save(user);

        return user;
    }



    async login ( email:string, password:string){
        const user = await this.userRepository.findOneBy({email});
        if(!user){
            throw new UserNotFound();
        }

         const isPass = await bcrypt.compare(password, user.password)
        if(!isPass){
            throw new InvalidPassword();
        }

        const token = generateToken(user.id, user.email, user.role );

        return {email: user.email,
            id: user.id,
            role:user.role,
            token: token
        };


    }
}

