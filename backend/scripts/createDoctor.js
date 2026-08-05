import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import DoctorProfile from '../models/DoctorProfile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const createDoctor = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB...');

    const email = 'dr.arjun@mediconsult.com';
    const password = 'password123';
    const name = 'Dr. Arjun Kumar';

    // Check if exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Doctor account already exists with this email.');
      process.exit(0);
    }

    // Get next DOC ID
    const count = await User.countDocuments({ role: 'doctor', doctorId: { $exists: true } });
    const doctorId = `DOC${1001 + count}`;

    const user = await User.create({
      name,
      email,
      password,
      role: 'doctor',
      doctorId,
      isActive: true,
      emailVerified: true
    });

    await DoctorProfile.create({
      userId: user._id,
      doctorId,
      specialization: 'Cardiology',
      experience: 15,
      medicalRegistrationNumber: 'REG-' + Date.now().toString().slice(-6),
      hospitalName: 'Medanta Hospital',
      city: 'Bangalore',
      consultationFee: 1500,
      verificationStatus: 'Approved',
      isVerified: true
    });

    console.log('=========================================');
    console.log('DOCTOR ACCOUNT CREATED SUCCESSFULLY');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Doctor ID: ${doctorId}`);
    console.log('=========================================');

    process.exit(0);
  } catch (err) {
    console.error('Error creating doctor:', err.message);
    process.exit(1);
  }
};

createDoctor();
