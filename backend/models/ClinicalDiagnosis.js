import mongoose from 'mongoose';

const clinicalDiagnosisSchema = new mongoose.Schema({
  doctorId: { type: String, required: true },
  doctorName: { type: String, required: true },
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  consultationDate: { type: Date, default: Date.now },

  chiefComplaint: { type: String },
  symptoms: { type: String },
  clinicalFindings: { type: String },
  diagnosis: { type: String, required: true },

  reportSummary: { type: String },
  reportInterpretation: { type: String },

  doctorsNotes: { type: String },
  treatmentPlan: { type: String },
  medicationsText: { type: String },
  medicationsPrescribed: { type: Array, default: [] },
  recommendedTests: { type: String },
  followUpInstructions: { type: String },
  nextReviewDate: { type: Date },

  attachments: { type: Array, default: [] },
  editHistory: { type: Array, default: [] },
  status: { type: String, default: 'Finalized' }
}, { timestamps: true });

// Robust Model Export
const ClinicalDiagnosis = mongoose.models.ClinicalDiagnosis || mongoose.model('ClinicalDiagnosis', clinicalDiagnosisSchema);

export default ClinicalDiagnosis;
