import { AppDataSource } from "@/config/data-source";
import { Package } from "@/entities/Package";
import { SmartBox } from "@/entities/SmartBox";
import { User } from "@/entities/User";
import { generateToken } from "@/utils/jwt";
import bcrypt from 'bcryptjs';
        

export class PackageService {
    private userRepository = AppDataSource.getRepository(User);
    private packageRepository = AppDataSource.getRepository(Package);
    private smartboxRepository = AppDataSource.getRepository(SmartBox);



    


    
}