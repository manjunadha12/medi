import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  deptId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'Active' },
  head: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Department = mongoose.model('Department', departmentSchema);
export default Department;
