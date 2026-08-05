import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  billType: { type: String },
  amount: { type: Number },
  status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
  date: { type: Date, default: Date.now },
  description: { type: String }
});

const Bill = mongoose.model('Bill', billSchema);
export default Bill;
