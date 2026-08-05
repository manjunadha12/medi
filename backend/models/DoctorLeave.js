import mongoose from 'mongoose';

const doctorLeaveSchema = new mongoose.Schema({
  leaveId: { type: String, unique: true },
  doctorId: { type: String, required: true },
  doctorName: { type: String },
  department: { type: String },
  leaveStartDate: { type: Date, required: true },
  leaveEndDate: { type: Date, required: true },
  reason: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  replacementDoctor: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const DoctorLeave = mongoose.model('DoctorLeave', doctorLeaveSchema);
export default DoctorLeave;
