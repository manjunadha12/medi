import mongoose from 'mongoose';

const followUpSchema = new mongoose.Schema({
  followUpId: { type: String, unique: true },
  patientId: { type: String, required: true },
  doctorId: { type: String, required: true },
  followUpDate: { type: Date, required: true },
  followUpTime: { type: String },
  reason: { type: String },
  priority: { type: String, enum: ['Normal', 'High'], default: 'Normal' },
  tokenNumber: { type: Number },
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' }
});

const FollowUp = mongoose.model('FollowUp', followUpSchema);
export default FollowUp;
