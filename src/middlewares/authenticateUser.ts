import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/jwt';

export function authenticateUser ( req: Request, res:Response, next: NextFunction){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({message:"Yetkisiz işlem"})
    }

     const token = authHeader.split(" ")[1];

     try{
        const verify = verifyToken(token);
        (req as any).email = verify.email,
        (req as any).userId = verify.userId,
        (req as any).role = verify.role

        next();


     }catch(error){
         return res.status(401).json({ message: "Geçersiz token." });

     }


    

}