import mongoose from 'mongoose';
import config from '../config';
import { User } from '../modules/User/user.model';

async function seedAdmin() {
  try {
    await mongoose.connect(config.database_url as string);

    const existingAdmin = await User.findOne({
      email: config.admin.email,
      role: 'admin',
    });
    if (existingAdmin) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    const adminUser = await User.create({
      name: 'Admin',
      email: config.admin.email,
      password: config.admin.password,
      role: 'admin',
      phone: config.admin.phone,
    });

    console.log('Admin user seeded successfully:', adminUser.email);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
