import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';
import { ApiResponse, User, LoginInput, RegisterInput } from '@osher/shared';
import { JWT_SECRET } from '../config.js';

export class AuthController {
  public static async register(req: Request, res: Response<ApiResponse<{ token: string, user: User }>>) {
    try {
      const { email, password, name, role, bio, phoneNumber, address }: RegisterInput = req.body;
      
      const existing = await UserModel.findOne({ email });
      if (existing) {
        res.status(400).json({ success: false, error: "User already exists" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create({ 
        email, 
        name, 
        password: hashedPassword, 
        role: role || 'user',
        bio,
        phoneNumber,
        address
      });

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
      
      const userResponse = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        bio: user.bio,
        phoneNumber: user.phoneNumber,
        address: user.address as any
      };

      res.status(201).json({ success: true, data: { token, user: userResponse } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async login(req: Request, res: Response<ApiResponse<{ token: string, user: User }>>) {
    try {
      const { email, password }: LoginInput = req.body;
      const user = await UserModel.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ success: false, error: "Invalid credentials" });
        return;
      }

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
      
      const userResponse = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      };

      res.json({ success: true, data: { token, user: userResponse } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async getProfile(req: Request, res: Response<ApiResponse<User>>) {
    try {
      const userId = (req as any).user.id;
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
      }
      res.json({
        success: true,
        data: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
