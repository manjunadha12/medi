import express from 'express';
const router = express.Router();
import { addMedicine, getMedicines, toggleTaken, deleteMedicine } from '../controllers/medicineController.js';
import { protect } from '../middleware/auth.js';

router.post('/', protect, addMedicine);
router.get('/:patientId', protect, getMedicines);
router.put('/toggle/:id', protect, toggleTaken);
router.delete('/:id', protect, deleteMedicine);

export default router;
