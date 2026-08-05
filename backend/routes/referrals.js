import express from 'express';
const router = express.Router();
import {
  getPatients,
  getReferralDoctors,
  addReferralDoctor,
  updateReferralDoctor,
  deleteReferralDoctor,
  getReferrals,
  createReferral,
  updateReferralStatus
} from '../controllers/referralController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

router.use(protect);
router.use(authorize('doctor'));

// Patients list endpoint
router.get('/patients', getPatients);

// Referral Doctors endpoints
router.get('/doctors', getReferralDoctors);
router.post('/doctors', addReferralDoctor);
router.put('/doctors/:id', updateReferralDoctor);
router.delete('/doctors/:id', deleteReferralDoctor);

// Referrals endpoints
router.get('/', getReferrals);
router.post('/', createReferral);
router.put('/:id', updateReferralStatus);

export default router;
