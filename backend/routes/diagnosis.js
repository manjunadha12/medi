import express from 'express';
const router = express.Router();
import {
  createDiagnosis,
  getPatientDiagnosisHistory,
  updateLatestDiagnosis,
  getDiagnosisById,
  getDoctorDiagnosisHistory
} from '../controllers/diagnosisController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

// Test route
router.get('/test', (req, res) => res.json([{ diagnosis: "Protocol Test Node", patientName: "Debug" }]));

// Specific routes first
router.get('/history/patient/:patientId', getPatientDiagnosisHistory);
router.get('/history/doctor/:doctorId', protect, getDoctorDiagnosisHistory);

// Generic/ID routes after
router.post('/create', protect, upload.array('attachments', 5), createDiagnosis);
router.get('/:id', protect, getDiagnosisById);
router.put('/:id', protect, updateLatestDiagnosis);

export default router;
