import { JWT_SECRET } from "@/config/constants";
import jwt from "jsonwebtoken";

export const generateToken = (userId:number, email:string, role: string)=> {
    return jwt.sign({userId, email, role}, JWT_SECRET, {
        expiresIn :10

    });
}

export const verifyToken = (token: string): { userId: number; email: string; role: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; role: string };
    return decoded;
  } catch (error) {
    throw new Error("Geçersiz veya süresi dolmuş token");
  }
};
