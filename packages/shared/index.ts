import { z } from 'zod';

// --- Roles ---
export type UserRole = 'admin' | 'user';

// --- Product ---
export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  image: z.string().url("Must be a valid URL"),
  category: z.string().min(1, "Category is required"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
});

export type Product = z.infer<typeof ProductSchema> & {
  averageRating?: number;
  reviewCount?: number;
  reviews?: Review[];
};

// --- User & Auth ---
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=(?:.*\d){4})(?=.*[!@%$#^&*\-_])[A-Za-z\d!@%$#^&*\-_]{8,}$/;
const passwordErrorMessage = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, at least four digits, and one special character (!@%$#^&*- _).";

export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().regex(passwordRegex, passwordErrorMessage).optional(),
  role: z.enum(['admin', 'user']).default('user'),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

export type User = z.infer<typeof UserSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = UserSchema.extend({
  password: z.string().regex(passwordRegex, passwordErrorMessage),
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

// --- Cart ---
export const CartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export type CartItem = z.infer<typeof CartItemSchema>;

// --- Order ---
export const AddressSchema = z.object({
  street: z.string().min(3, "Street is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(4, "Zip code is required"),
  country: z.string().min(2, "Country is required"),
});

export type Address = z.infer<typeof AddressSchema>;

export const OrderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().positive(),
});

export const OrderSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  items: z.array(OrderItemSchema),
  totalPrice: z.number().nonnegative(),
  address: AddressSchema.optional(),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
  createdAt: z.string().optional(),
});

export type Order = z.infer<typeof OrderSchema>;

// --- Review ---
export const ReviewSchema = z.object({
  id: z.string().optional(),
  productId: z.string(),
  userId: z.string().optional(),
  userName: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(3),
  createdAt: z.string().optional(),
});

export type Review = z.infer<typeof ReviewSchema>;

// --- API Response ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
