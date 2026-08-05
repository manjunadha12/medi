import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  referralId: { type: String, unique: true, required: true },
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  referredDoctorId: { type: String, required: true }, // External/Referral Doctor ID
  referredDoctorName: { type: String, required: true },
  referringDoctorId: { type: String, required: true }, // The referring doctor user ID
  referringDoctorName: { type: String, required: true },
  referralReason: { type: String, required: true },
  diagnosis: { type: String },
  notes: { type: String },
  recommendations: { type: String },
  priority: { type: String, enum: ['Normal', 'Urgent', 'Emergency'], default: 'Normal' },
  status: { type: String, enum: ['Pending', 'Accepted', 'Completed', 'Cancelled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const Referral = mongoose.model('Referral', referralSchema);
export default Referral;
