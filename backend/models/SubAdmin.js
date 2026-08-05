import mongoose from 'mongoose';

const subAdminSchema = new mongoose.Schema({
  subAdminId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String },
  role: { type: String, required: true },
  permissions: [{ type: String }], // e.g., 'billing', 'reports', 'verification'
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const SubAdmin = mongoose.model('SubAdmin', subAdminSchema);
export default SubAdmin;
