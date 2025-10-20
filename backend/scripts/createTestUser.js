import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/deone';

async function create() {
  try {
    await db.connectDB(MONGO_URI, { retries: 3 });

    const email = process.env.TEST_USER_EMAIL || 'teststudent@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'Test1234!';
    const name = process.env.TEST_USER_NAME || 'Test Student';

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('User already exists:', email);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role: 'estudiante' });
    await user.save();
    console.log('Created test user:', email);
    console.log('Password:', password);
    process.exit(0);
  } catch (err) {
    console.error('Error creating test user:', err);
    process.exit(1);
  }
}

create();
