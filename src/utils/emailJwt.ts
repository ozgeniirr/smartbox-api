import jwt from "jsonwebtoken";

export function generateVerificationToken(userId: number, email: string) {
  return jwt.sign(
    {
      userId,
      email,
      type: 'verify'
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: '5m'
    }
  );
}
