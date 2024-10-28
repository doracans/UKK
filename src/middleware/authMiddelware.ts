import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { role: string };

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      // req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
};

export default authMiddleware;
