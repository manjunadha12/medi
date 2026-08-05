import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true },
  adminName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hospitalName: { type: String, default: 'Medi Consult Hospital' },
  hospitalCode: { type: String, default: 'HOSP2024' },
  role: { type: String, default: 'admin' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  lastLogin: { type: Date },
  profilePhoto: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
