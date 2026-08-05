import mongoose from 'mongoose';
import User from '../models/User.js';

// Pre-register model
import '../models/ClinicalDiagnosis.js';

export const createDiagnosis = async (req, res) => {
  try {
    const ClinicalDiagnosis = mongoose.model('ClinicalDiagnosis');
    const {
      patientId, patientName, diagnosis, chiefComplaint, symptoms, clinicalFindings,
      reportSummary, reportInterpretation, doctorsNotes, treatmentPlan,
      medicationsPrescribed, medicationsText, recommendedTests, followUpInstructions, nextReviewDate,
      consultationDate
    } = req.body;

    let attachments = [];
    if (req.files) {
      attachments = req.files.map(file => ({
        name: file.originalname,
        url: `/uploads/${file.filename}`,
        fileType: file.mimetype
      }));
    }

    const doctorId = req.user.doctorId || req.user._id.toString();
    const doctorName = req.user.name;

    const newDiagnosis = new ClinicalDiagnosis({
      doctorId,
      doctorName,
      patientId,
      patientName,
      diagnosis,
      chiefComplaint,
      symptoms,
      clinicalFindings,
      reportSummary,
      reportInterpretation,
      doctorsNotes,
      treatmentPlan,
      medicationsPrescribed,
      medicationsText,
      recommendedTests,
      followUpInstructions,
      nextReviewDate: nextReviewDate || null,
      consultationDate: consultationDate || Date.now(),
      attachments
    });

    await newDiagnosis.save();
    res.status(201).json({ success: true, message: 'Diagnosis record established', data: newDiagnosis });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientDiagnosisHistory = async (req, res) => {
  try {
    const ClinicalDiagnosis = mongoose.model('ClinicalDiagnosis');
    const patientId = req.params.patientId?.toUpperCase();
    if (!patientId || patientId === 'UNDEFINED') return res.json([]);

    console.log(`[DIAGNOSIS_SYNC] Handshaking with ledger for: ${patientId}`);

    const history = await ClinicalDiagnosis.find({ patientId }).sort({ consultationDate: -1 }).lean();

    return res.json(history || []);
  } catch (error) {
    console.error(`[DIAGNOSIS_FATAL_ERROR]:`, error);
    return res.status(500).json({ success: false, message: "Internal diagnostic ledger failure" });
  }
};

export const getDoctorDiagnosisHistory = async (req, res) => {
  try {
    const ClinicalDiagnosis = mongoose.model('ClinicalDiagnosis');
    const { doctorId } = req.params;
    const history = await ClinicalDiagnosis.find({ doctorId }).sort({ consultationDate: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLatestDiagnosis = async (req, res) => {
  try {
    const ClinicalDiagnosis = mongoose.model('ClinicalDiagnosis');
    const { id } = req.params;
    const updates = req.body;

    const existing = await ClinicalDiagnosis.findById(id);
    if (!existing) return res.status(404).json({ message: 'Record not found' });

    const prevValues = {
      diagnosis: existing.diagnosis,
      treatmentPlan: existing.treatmentPlan,
      doctorsNotes: existing.doctorsNotes
    };

    existing.editHistory.push({
      updatedBy: req.user.name,
      previousValues: prevValues
    });

    Object.assign(existing, updates);

    await existing.save();
    res.json({ success: true, message: 'Diagnosis node updated', data: existing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDiagnosisById = async (req, res) => {
  try {
    const ClinicalDiagnosis = mongoose.model('ClinicalDiagnosis');
    const diagnosis = await ClinicalDiagnosis.findById(req.params.id);
    if (!diagnosis) return res.status(404).json({ message: 'Record not found' });
    res.json(diagnosis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
