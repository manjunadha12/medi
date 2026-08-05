import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  time: { type: String, required: true }, // Format: HH:mm (24h)
  food: { type: String, enum: ['Before Food', 'After Food', 'With Food'], default: 'After Food' },
  days: [String], // ['Mon', 'Tue', ...]
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
  takenLogs: [{
    date: { type: String }, // Format: YYYY-MM-DD
    status: { type: Boolean, default: false }
  }]
});

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;
