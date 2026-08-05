import mongoose from 'mongoose';

const referralDoctorSchema = new mongoose.Schema({
  doctorId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  hospitalName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String },
  availabilityStatus: { type: String, enum: ['Available', 'Unavailable'], default: 'Available' },
  createdAt: { type: Date, default: Date.now }
});

const ReferralDoctor = mongoose.model('ReferralDoctor', referralDoctorSchema);
export default ReferralDoctor;
