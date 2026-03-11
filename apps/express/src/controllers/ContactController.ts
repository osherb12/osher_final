import { Request, Response } from 'express';
import { ContactModel } from '../models/Contact.js';
import { ApiResponse } from '@osher/shared';

export class ContactController {
  public static async submit(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { name, email, message } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
      }

      const contact = await ContactModel.create({ name, email, message });
      
      res.status(201).json({ 
        success: true, 
        message: 'Your inquiry has been received. Our team will contact you shortly.' 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Admin method to view inquiries
  public static async getAll(req: Request, res: Response<ApiResponse<any[]>>) {
    try {
      const inquiries = await ContactModel.find().sort({ createdAt: -1 });
      res.json({ success: true, data: inquiries });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
