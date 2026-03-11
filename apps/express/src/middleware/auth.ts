import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ success: false, error: "No token, authorization denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: "Token is not valid" });
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user?.role !== 'admin') {
    res.status(403).json({ success: false, error: "Admin resource, access denied" });
    return;
  }
  next();
};
