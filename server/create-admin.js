import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

import Admin from './models/Admin.model.js';

const createAdmin = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@ishwarrugs.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin already exists');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin@123', 10);

    // Create admin
    const admin = await Admin.create({
      username: 'Admin',
      email: 'admin@ishwarrugs.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin created successfully!');
    console.log('');
    console.log('📧 Email: admin@ishwarrugs.com');
    console.log('🔐 Password: admin@123');
    console.log('');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
