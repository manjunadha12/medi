import mongoose from 'mongoose';

const medicineReminderSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  medicineName: { type: String, required: true },
  dosage: { type: String },
  time: { type: String },
  foodInstruction: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, enum: ['Active', 'Completed'], default: 'Active' },
  history: [{
    date: Date,
    status: { type: String, enum: ['Taken', 'Missed'] }
  }]
});

const MedicineReminder = mongoose.model('MedicineReminder', medicineReminderSchema);
export default MedicineReminder;
