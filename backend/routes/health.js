import express from 'express';
const router = express.Router();
import { addHealthLog, getHealthLogs, analyzeHealthTrends, cleanHealthData, deleteAllHealthLogs } from '../controllers/healthController.js';
import { protect } from '../middleware/auth.js';

router.post('/log', protect, addHealthLog);
router.get('/logs/:patientId', protect, getHealthLogs);
router.post('/analyze', protect, analyzeHealthTrends);
router.post('/clean/:patientId', protect, cleanHealthData);
router.delete('/all/:patientId', protect, deleteAllHealthLogs);

export default router;
