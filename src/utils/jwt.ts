import jwt from "jsonwebtoken";

// dotenv'i burada kullanmana gerek yok, eğer `config/constants.ts` içinde zaten dotenv çağrıldıysa
const JWT_SECRET = process.env.JWT_SECRET as string;

export function generateToken(userId: number, email: string, role: string) {
  return jwt.sign({ userId, email, role }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}

export const verifyToken = (token: string): { userId: number; email: string; role: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      role: string;
    };
    return decoded;
  } catch (error) {
    throw new Error("Geçersiz veya süresi dolmuş token");
  }
};
