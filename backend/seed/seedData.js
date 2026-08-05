import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import DoctorProfile from '../models/DoctorProfile.js';
import PatientProfile from '../models/PatientProfile.js';

dotenv.config();

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB: ' + process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected. Initializing Database Node...');

    // Clear existing data in the new official database
    await User.deleteMany({});
    await DoctorProfile.deleteMany({});
    await PatientProfile.deleteMany({});

    // 1. CREATE ADMIN NODE
    const admin = await User.create({
      name: 'Central Administrator',
      email: 'admin@mediconsult.com',
      password: 'Admin@123', // Will be hashed by User model pre-save hook
      role: 'admin',
      adminId: 'ADM1001',
      isActive: true,
      authProvider: 'Local'
    });
    console.log('✅ Admin Node Created: ADM1001');

    // 2. CREATE DOCTOR NODE
    const doctorUser = await User.create({
      name: 'Dr. Naresh Trehan',
      email: 'doctor@mediconsult.com',
      password: 'Doctor@123',
      role: 'doctor',
      doctorId: 'DOC1001',
      isActive: true,
      authProvider: 'Local'
    });

    await DoctorProfile.create({
      userId: doctorUser._id,
      doctorId: 'DOC1001',
      specialization: 'Cardiovascular Surgeon',
      hospitalName: 'Medanta Hospital',
      department: 'Cardiology',
      experience: 40,
      consultationFee: 2500,
      isVerified: true // Auto-verified for seeding
    });
    console.log('✅ Doctor Node Created: DOC1001');

    // 3. CREATE TEST PATIENT NODE
    const patientUser = await User.create({
      name: 'Manjunadha',
      email: 'dmanjunadha06@gmail.com',
      password: 'Patient@123',
      role: 'patient',
      patientId: 'PAT1001',
      isActive: true,
      authProvider: 'Local'
    });

    await PatientProfile.create({
      userId: patientUser._id,
      patientId: 'PAT1001',
      age: 25,
      gender: 'Male',
      bloodGroup: 'A+'
    });
    console.log('✅ Patient Node Created: PAT1001');

    console.log('\n=================================================');
    console.log('DATABASE SEEDED SUCCESSFULLY');
    console.log('Database: mediconsult_official');
    console.log('=================================================\n');

    process.exit();
  } catch (error) {
    console.error(`❌ Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
