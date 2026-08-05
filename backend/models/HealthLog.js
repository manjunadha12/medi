import mongoose from 'mongoose';

const healthLogSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  bp_systolic: { type: Number },
  bp_diastolic: { type: Number },
  temperature: { type: Number },
  heartbeat: { type: Number },
  sugar: { type: Number },
  oxygen: { type: Number },
  weight: { type: Number },
  notes: { type: String }
});

const HealthLog = mongoose.model('HealthLog', healthLogSchema);
export default HealthLog;
