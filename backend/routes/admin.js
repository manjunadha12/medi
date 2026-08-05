import express from 'express';
const router = express.Router();
import { 
  getDashboardSummary, 
  getDoctors, 
  getPatients, 
  verifyDoctor, 
  backupSystem,
  deleteDoctor,
  deletePatient,
  toggleDoctorStatus,
  togglePatientStatus,
  getPatientDetails,
  getDoctorDetails,
  updateDoctorDetails
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard-summary', getDashboardSummary);
router.get('/doctors', getDoctors);
router.get('/patients', getPatients);
router.get('/doctor/:doctorId', getDoctorDetails);
router.put('/doctor/:doctorId', updateDoctorDetails);
router.post('/doctor/:id/verify', verifyDoctor);
router.post('/doctor/:id/toggle-status', toggleDoctorStatus);
router.delete('/doctor/:id', deleteDoctor);
router.post('/patient/:id/toggle-status', togglePatientStatus);
router.delete('/patient/:id', deletePatient);
router.get('/patient/:patientId', getPatientDetails);
router.post('/backup', backupSystem);

export default router;
