import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  doctorId: { type: String, required: true },
  patientId: { type: String, required: true },
  symptoms: { type: String },
  diagnosis: { type: String },
  clinicalObservations: { type: String },
  notes: { type: String },
  remarks: { type: String },
  privateNotes: { type: String },
  status: { type: String, default: 'Completed' },
  consultationDate: { type: Date, default: Date.now },
  followUpDate: { type: Date }
});

const Consultation = mongoose.model('Consultation', consultationSchema);
export default Consultation;
