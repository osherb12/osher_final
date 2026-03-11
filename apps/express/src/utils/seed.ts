import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

import 'reflect-metadata';
import mongoose from 'mongoose';
import { ProductModel } from '../models/Product';
import { UserModel } from '../models/User';
import { OrderModel } from '../models/Order';
import { ReviewModel } from '../models/Review';
import { ContactModel } from '../models/Contact';
import { CategoryModel } from '../models/Category';
import bcrypt from 'bcryptjs';

const products = [
// ... existing products ...
  // Electronics
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-canceling over-ear headphones with 40h battery life and exceptional sound quality.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Electronics',
    stock: 50,
  },
  {
    name: 'Smart Watch',
    description: 'Feature-packed smart watch with heart rate monitor, GPS, and fitness tracking.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Electronics',
    stock: 30,
  },
  {
    name: 'Laptop Pro 15"',
    description: 'High-performance laptop with 16GB RAM, 512GB SSD, and stunning display.',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Electronics',
    stock: 15,
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with premium switches and aluminum frame.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Electronics',
    stock: 45,
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking and long battery life.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Electronics',
    stock: 80,
  },
  {
    name: 'Smartphone 128GB',
    description: 'Latest flagship smartphone with advanced camera system and 5G connectivity.',
    price: 799.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Electronics',
    stock: 25,
  },
  {
    name: 'Tablet 10"',
    description: 'Versatile tablet perfect for work and entertainment with stylus support.',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Electronics',
    stock: 35,
  },
  {
    name: 'Portable Speaker',
    description: 'Waterproof Bluetooth speaker with 360° sound and 20h playtime.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Electronics',
    stock: 60,
  },

  // Apparel
  {
    name: 'Classic T-Shirt',
    description: 'Premium 100% cotton t-shirt in various colors. Soft, comfortable, and durable.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Apparel',
    stock: 100,
  },
  {
    name: 'Denim Jacket',
    description: 'Timeless denim jacket with classic fit and premium quality fabric.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Apparel',
    stock: 40,
  },
  {
    name: 'Sneakers',
    description: 'Comfortable and stylish sneakers perfect for everyday wear.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Apparel',
    stock: 70,
  },
  {
    name: 'Leather Backpack',
    description: 'Genuine leather backpack with laptop compartment and multiple pockets.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Apparel',
    stock: 30,
  },
  {
    name: 'Sunglasses',
    description: 'UV protection sunglasses with polarized lenses and stylish frames.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Apparel',
    stock: 55,
  },
  {
    name: 'Hoodie',
    description: 'Cozy fleece hoodie with adjustable drawstring and kangaroo pocket.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Apparel',
    stock: 85,
  },

  // Home & Living
  {
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe and auto-brew function.',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Home & Living',
    stock: 40,
  },
  {
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness and USB charging port.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Home & Living',
    stock: 65,
  },
  {
    name: 'Indoor Plant Set',
    description: 'Set of 3 low-maintenance indoor plants with decorative pots.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Home & Living',
    stock: 50,
  },
  {
    name: 'Throw Blanket',
    description: 'Ultra-soft throw blanket perfect for cozy evenings.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1604595704321-f24afaa2fa6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Home & Living',
    stock: 90,
  },
  {
    name: 'Wall Clock',
    description: 'Modern minimalist wall clock with silent movement.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Home & Living',
    stock: 45,
  },
  {
    name: 'Candle Set',
    description: 'Set of 4 scented candles with relaxing aromas and 40h burn time each.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1602874801006-c2b99a82d3a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Home & Living',
    stock: 75,
  },

  // Books & Stationery
  {
    name: 'Leather Journal',
    description: 'Premium leather-bound journal with thick acid-free pages.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Books & Stationery',
    stock: 60,
  },
  {
    name: 'Fountain Pen Set',
    description: 'Elegant fountain pen set with ink cartridges and gift box.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Books & Stationery',
    stock: 35,
  },
  {
    name: 'Desk Organizer',
    description: 'Wooden desk organizer with multiple compartments for office supplies.',
    price: 27.99,
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Books & Stationery',
    stock: 55,
  },

  // Sports & Fitness
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat with extra cushioning and carrying strap.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Sports & Fitness',
    stock: 70,
  },
  {
    name: 'Water Bottle',
    description: 'Stainless steel insulated water bottle keeps drinks cold for 24h.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Sports & Fitness',
    stock: 100,
  },
  {
    name: 'Resistance Bands Set',
    description: 'Set of 5 resistance bands with different tension levels and door anchor.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Sports & Fitness',
    stock: 80,
  },
  {
    name: 'Dumbbell Set',
    description: 'Adjustable dumbbell set with weights ranging from 5 to 25 lbs.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Sports & Fitness',
    stock: 25,
  },
];

const seed = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/osher';
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding');
    
    // Clear all collections
    await ProductModel.deleteMany({});
    console.log('Cleared products');
    
    await UserModel.deleteMany({});
    console.log('Cleared users');

    await OrderModel.deleteMany({});
    console.log('Cleared orders');

    await ReviewModel.deleteMany({});
    console.log('Cleared reviews');

    await CategoryModel.deleteMany({});
    console.log('Cleared categories');

    await ContactModel.deleteMany({});
    console.log('Cleared contact inquiries');
    
    // Seed Categories first
    const categoryNames = [...new Set(products.map(p => p.category))];
    await CategoryModel.insertMany(categoryNames.map(name => ({ name })));
    console.log('Seeded categories successfully');

    // Insert products
    await ProductModel.insertMany(products);
    console.log('Seeded products successfully');
    
    // Create Default Admin
    const adminPassword = 'adminpassword';
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
    await UserModel.create({
      email: 'admin@osher.com',
      name: 'Admin User',
      password: hashedAdminPassword,
      role: 'admin'
    });
    console.log('--- DEFAULT ADMIN CREATED ---');
    console.log('Email: admin@osher.com');
    console.log('Password: ' + adminPassword);
    console.log('-----------------------------');

    // Create Default User
    const userPassword = 'userpassword';
    const hashedUserPassword = await bcrypt.hash(userPassword, 10);
    await UserModel.create({
      email: 'user@osher.com',
      name: 'Regular User',
      password: hashedUserPassword,
      role: 'user'
    });
    console.log('--- DEFAULT USER CREATED ---');
    console.log('Email: user@osher.com');
    console.log('Password: ' + userPassword);
    console.log('-----------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
