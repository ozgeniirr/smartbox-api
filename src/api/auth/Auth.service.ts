import { AppDataSource } from "@/config/data-source";
import { User } from "@/entities/User";
import { generateToken } from "@/utils/jwt";
import bcrypt from 'bcryptjs';
        


export class AuthService {
    private userRepository = AppDataSource.getRepository(User);

    async register(email:string, password: string){
        const existingUser = await this.userRepository.findOneBy({email});

        if(existingUser){
            throw new Error("EMAIL_EXIST")
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
            throw new Error("NO_USER");
        }

         const isPass = await bcrypt.compare(password, user.password)
        if(!isPass){
            throw new Error("INVALID_PASSWORD")
        }

        const token = generateToken(user.id, user.email, user.role );

        return {email: user.email,
            id: user.id,
            role:user.role,
            token: token
        };


    }
}

