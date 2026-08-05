import express from 'express';
const router = express.Router();
import {
  analyzeReport,
  getDoctorSuggestion,
  getCostEstimation,
  chatWithAI,
  analyzeMedicine,
  getMedicineSuggestions,
  searchHospitalAI
} from '../controllers/aiController.js';
import { getPublicDoctorProfile } from '../controllers/doctorController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

router.post('/analyze-report', protect, analyzeReport);
router.post('/doctor-suggestion', protect, getDoctorSuggestion);
router.get('/doctor-profile/:doctorId', protect, getPublicDoctorProfile);
router.post('/cost-estimation', protect, getCostEstimation);
router.post('/chat', protect, upload.single('file'), chatWithAI);
router.post('/analyze-medicine', protect, analyzeMedicine);
router.get('/medicine-suggestions', protect, getMedicineSuggestions);
router.post('/search-hospital', searchHospitalAI);

export default router;
