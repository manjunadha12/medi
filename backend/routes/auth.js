import express from 'express';
const router = express.Router();
import { 
  registerPatient, 
  registerDoctor, 
  login, 
  getMe,
  registerPatientOtp,
  verifyPatientOtp,
  resendPatientOtp,
  loginRequestOtp,
  loginVerifyOtp,
  forgotPasswordRequestOtp,
  forgotPasswordResendOtp,
  forgotPasswordVerifyAndReset,
  updateSecuritySettings,
  googleLogin
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

router.post('/register/patient', registerPatient);
router.post('/register/patient-otp', registerPatientOtp);
router.post('/register/verify-patient', verifyPatientOtp);
router.post('/register/resend-otp', resendPatientOtp);
router.post('/register/doctor', upload.array('documents', 10), registerDoctor);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/logout', (req, res) => res.json({ success: true, message: 'Logged out successfully' }));
router.post('/login/request-otp', loginRequestOtp);
router.post('/login/verify-otp', loginVerifyOtp);
router.post('/forgot-password/request-otp', forgotPasswordRequestOtp);
router.post('/forgot-password/resend-otp', forgotPasswordResendOtp);
router.post('/forgot-password/reset', forgotPasswordVerifyAndReset);
router.get('/me', protect, getMe);
router.get('/profile', protect, getMe);
router.put('/security-settings', protect, updateSecuritySettings);

export default router;
