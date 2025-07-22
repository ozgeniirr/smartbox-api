import { Request, Response, NextFunction } from 'express';

export function authorizeRole(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).role;

    if (userRole !== requiredRole) {
      return res.status(403).json({ message: "Yetkiniz yok." });
    }

    next();
  };
}
