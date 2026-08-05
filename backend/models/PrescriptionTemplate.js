import mongoose from 'mongoose';

const prescriptionTemplateSchema = new mongoose.Schema({
  doctorId: { type: String, required: true },
  name: { type: String, required: true }, // Template name (e.g. Cough protocol)
  specialty: { type: String },
  diagnosis: { type: String },
  medicines: [{
    name: { type: String, required: true },
    genericName: { type: String },
    brandName: { type: String },
    strength: { type: String },
    dosageForm: { type: String },
    manufacturer: { type: String },
    dosage: { type: String },
    frequency: { type: String },
    foodInstruction: { type: String },
    durationValue: { type: Number },
    durationUnit: { type: String, default: 'Days' },
    morning: { type: Boolean, default: false },
    afternoon: { type: Boolean, default: false },
    night: { type: Boolean, default: false },
    specialInstructions: { type: String },
    quantity: { type: Number }
  }],
  createdAt: { type: Date, default: Date.now }
});

const PrescriptionTemplate = mongoose.model('PrescriptionTemplate', prescriptionTemplateSchema);
export default PrescriptionTemplate;
