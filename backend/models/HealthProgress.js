import mongoose from 'mongoose';

const healthProgressSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  temperature: { type: Number },
  bp: { type: String },
  sugar: { type: Number },
  oxygen: { type: Number },
  sleep: { type: Number },
  painLevel: { type: Number },
  symptoms: [String],
  medicineTaken: { type: Boolean },
  recoveryScore: { type: Number }
});

const HealthProgress = mongoose.model('HealthProgress', healthProgressSchema);
export default HealthProgress;
