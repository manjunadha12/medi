import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema({
  otpExpiryTime: { type: Number, default: 5 }, // in minutes
  tokenPrefix: { type: String, default: 'TOK' },
  patientIdPrefix: { type: String, default: 'PAT' },
  doctorIdPrefix: { type: String, default: 'DOC' },
  adminIdPrefix: { type: String, default: 'ADM' },
  appointmentSlotDuration: { type: Number, default: 15 }, // in minutes
  maxOPPerDoctor: { type: Number, default: 50 },
  aiFeaturesEnabled: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  backupSettings: {
    autoBackup: { type: Boolean, default: true },
    frequency: { type: String, default: 'Daily' }
  }
});

const SystemSettings = mongoose.model('SystemSettings', systemSettingsSchema);
export default SystemSettings;
