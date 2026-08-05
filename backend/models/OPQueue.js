import mongoose from 'mongoose';

const opQueueSchema = new mongoose.Schema({
  tokenNumber: { type: Number, required: true },
  patientId: { type: String, required: true },
  doctorId: { type: String, required: true },
  patientName: { type: String, required: true },
  age: { type: Number },
  problem: { type: String },
  priority: { type: String, enum: ['Emergency', 'High Priority', 'Normal', 'Follow-up'], default: 'Normal' },
  status: { type: String, enum: ['Waiting', 'In Consultation', 'Completed', 'Emergency', 'Follow-up'], default: 'Waiting' },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const OPQueue = mongoose.model('OPQueue', opQueueSchema);
export default OPQueue;
