import express from 'express';
import {
  bookOP,
  getDoctorQueue,
  getPatientAppointments,
  shareOpinion,
  requestSecondOpinion,
  getAppointmentDetails,
  getDoctorHistory,
  acceptAppointment,
  getPatientSummary,
  updatePaymentStatus,
  verifyRazorpayPayment,
  startConsultation,
  generateManualToken,
  getGlobalQueue
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/book', bookOP);
router.get('/doctor-queue', getDoctorQueue);
router.get('/doctor-history', getDoctorHistory);
router.get('/patient-list', getPatientAppointments);
router.get('/patient-summary', getPatientSummary);
router.put('/payment-status/:id', updatePaymentStatus);
router.put('/start-session/:id', startConsultation);
router.post('/verify-razorpay', verifyRazorpayPayment);
router.get('/:id', getAppointmentDetails);
router.post('/share-opinion', shareOpinion);
router.post('/request-second-opinion', requestSecondOpinion);
router.put('/accept/:id', acceptAppointment);
router.post('/generate-manual', generateManualToken);
router.get('/global-queue', getGlobalQueue);

export default router;
