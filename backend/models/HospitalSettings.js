import mongoose from 'mongoose';

const hospitalSettingsSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  hospitalCode: { type: String, required: true },
  address: { type: String },
  contactNumber: { type: String },
  email: { type: String },
  workingHours: { type: String },
  emergencyContact: { type: String },
  logo: { type: String },
  consultationFee: { type: Number },
  videoConsultationFee: { type: Number },
  hospitalRegistrationNumber: { type: String }
});

const HospitalSettings = mongoose.model('HospitalSettings', hospitalSettingsSchema);
export default HospitalSettings;
