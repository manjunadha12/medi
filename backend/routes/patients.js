import express from 'express';
const router = express.Router();
import { getPatientProfile, updatePatientProfile, getPatientPrescriptions, deletePrescription } from '../controllers/patientController.js';
import { protect } from '../middleware/auth.js';

router.get('/profile/:userId', protect, getPatientProfile);
router.put('/profile/:userId', protect, updatePatientProfile);
router.get('/prescriptions', protect, getPatientPrescriptions);
router.delete('/prescription/:id', protect, deletePrescription);

export default router;
