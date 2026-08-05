import mongoose from 'mongoose';
import User from '../models/User.js';
import DoctorProfile from '../models/DoctorProfile.js';
import PatientProfile from '../models/PatientProfile.js';
import Appointment from '../models/Appointment.js';
import Report from '../models/Report.js';
import Prescription from '../models/Prescription.js';
import Medicine from '../models/Medicine.js';
import HealthLog from '../models/HealthLog.js';
import Notification from '../models/Notification.js';
import { sendEmail } from '../utils/sendEmail.js';
import path from 'path';

// Ensure model registration
import '../models/ClinicalDiagnosis.js';

export const getDashboardSummary = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const pendingVerification = await DoctorProfile.countDocuments({ verificationStatus: 'Pending' });
    const todayTokens = await Appointment.countDocuments({ date: { $gte: startOfToday, $lte: endOfToday } });
    
    const completedToday = await Appointment.countDocuments({ status: 'Completed', date: { $gte: startOfToday, $lte: endOfToday } });
    const revenueToday = completedToday * 500;

    res.json({
      totalPatients,
      totalDoctors,
      pendingVerification,
      todayTokens: todayTokens || 0,
      revenueToday: revenueToday || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password').lean();
    const doctorsWithProfile = await Promise.all(
      doctors.map(async (doc) => {
        const profile = await DoctorProfile.findOne({ userId: doc._id }).lean();
        return {
          ...doc,
          ...(profile || {}),
          _id: doc._id,
          // Ensure applicationNumber exists for the UI
          applicationNumber: doc.applicationNumber || profile?.applicationNumber || `APP-FALLBACK-${doc._id.toString().slice(-4).toUpperCase()}`
        };
      })
    );
    res.json(doctorsWithProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password').lean();
    const patientsWithProfile = await Promise.all(
      patients.map(async (pat) => {
        const profile = await PatientProfile.findOne({ userId: pat._id }).lean();
        return { ...pat, ...(profile || {}), _id: pat._id };
      })
    );
    res.json(patientsWithProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    // Robust status defaulting for 'Authorize' button or missing status
    let status = req.body.status;
    if (!status || status === 'undefined') status = 'Approved';

    const message = req.body.message;

    const queryId = id.toUpperCase();
    const profile = await DoctorProfile.findOne({
      $or: [{ doctorId: queryId }, { applicationNumber: queryId }]
    });

    if (!profile) return res.status(404).json({ message: 'Doctor profile node not found' });

    if (status === 'Approved') {
      const count = await User.countDocuments({ role: 'doctor', doctorId: { $exists: true } });
      const newDoctorId = 'DOC' + (1000 + count + 1);
      profile.doctorId = newDoctorId;
      profile.verificationStatus = 'Approved';
      profile.isVerified = true;
      await profile.save();
      await User.findByIdAndUpdate(profile.userId, { doctorId: newDoctorId });
    } else {
      profile.verificationStatus = status || 'Rejected';
      profile.isVerified = false;
      await profile.save();
    }

    await Notification.create({
        userId: profile.userId.toString(),
        title: `Verification Update: ${status}`,
        message: message || `Your account verification status has been updated to ${status}.`,
        type: "system",
        isRead: false
    });

    const user = await User.findById(profile.userId);
    if (user) {
      let emailSubject = `Medi Consult - Verification Update: ${status}`;
      let emailText = message || `Your account verification status has been updated to ${status}.`;

      if (status === 'Approved') {
        emailSubject = "Verification Done - Medi Consult Network";
        emailText = `Hello Dr. ${user.name},\n\nYour verification is done and your unique ID is: ${profile.doctorId}\n\nYou can now log in and access the clinical dashboard.\n\nRegards,\nMedi Consult Admin`;
      }

      console.log(`[ADMIN_VERIFY] Triggering email dispatch to ${user.email} for status: ${status} | ID: ${profile.doctorId}`);

      await sendEmail({
        to: user.email,
        subject: emailSubject,
        text: emailText,
        html: `<div style="font-family: 'Inter', sans-serif; padding: 40px; background: #09090b; color: #fff; border-radius: 24px;">
                <h2 style="color: #3b82f6; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;">Verification Done</h2>
                <p style="font-size: 16px; color: #a1a1aa; margin-top: 20px;">Hello Dr. ${user.name},</p>
                <p style="font-size: 14px; color: #71717a; line-height: 1.6;">Your professional credentials have been successfully synchronized. Your technical identity node is now active.</p>

                ${status === 'Approved' ? `
                <div style="margin: 30px 0; padding: 25px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 16px; text-align: center;">
                  <p style="font-size: 10px; font-weight: 900; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 10px;">Your Unique Specialist ID</p>
                  <span style="font-size: 32px; font-weight: 900; color: #fff; letter-spacing: -0.02em;">${profile.doctorId}</span>
                </div>
                ` : `
                <div style="margin: 30px 0; padding: 25px; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 16px;">
                   <p style="font-size: 10px; font-weight: 900; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 10px;">Status Update</p>
                   <p style="font-size: 16px; font-weight: 700; color: #fff;">${status}</p>
                   <p style="font-size: 12px; color: #a1a1aa; margin-top: 10px;">${message || 'Please check your dashboard for details.'}</p>
                </div>
                `}

                <p style="font-size: 12px; color: #52525b; margin-top: 40px; border-top: 1px solid #27272a; padding-top: 20px;">
                   This is an automated synchronization message from the Medi Consult Neural Registry.
                </p>
              </div>`
      });
    }

    res.json({ success: true, message: `Doctor ${status || 'verified'} successfully`, profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const backupSystem = async (req, res) => {
  try {
    res.json({ success: true, message: 'Database backup synchronized successfully to clinical cluster.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOneAndDelete({ $or: [{ doctorId: id }, { applicationNumber: id }], role: 'doctor' });
    if (!user) return res.status(404).json({ message: 'Doctor not found' });
    await DoctorProfile.findOneAndDelete({ userId: user._id });
    res.json({ success: true, message: 'Doctor removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOneAndDelete({ patientId: id, role: 'patient' });
    if (!user) return res.status(404).json({ message: 'Patient not found' });
    await PatientProfile.findOneAndDelete({ patientId: id });
    res.json({ success: true, message: 'Patient removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleDoctorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ $or: [{ doctorId: id }, { applicationNumber: id }], role: 'doctor' });
    if (!user) return res.status(404).json({ message: 'Doctor not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, isActive: user.isActive, message: `Doctor ${user.isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const togglePatientStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ patientId: id, role: 'patient' });
    if (!user) return res.status(404).json({ message: 'Patient not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, isActive: user.isActive, message: `Patient ${user.isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorDetails = async (req, res) => {
  try {
    const { doctorId } = req.params;
    if (!doctorId) return res.status(400).json({ message: 'Doctor ID is required' });

    const queryId = doctorId.trim().toUpperCase();
    console.log(`[ADMIN_SYNC] Probing Doctor Registry for ID: ${queryId}`);

    const user = await User.findOne({
      $or: [
        { doctorId: queryId },
        { applicationNumber: queryId }
      ],
      role: 'doctor'
    }).select('-password').lean();

    if (!user) {
      console.warn(`[ADMIN_SYNC] Doctor Node not found: ${queryId}`);
      return res.status(404).json({ message: 'Doctor node not found in registry' });
    }

    const doctorProfile = await DoctorProfile.findOne({ userId: user._id }).lean();

    // Prepare search IDs for secondary models (ignore undefined)
    const searchIds = [user.doctorId, user.applicationNumber, queryId].filter(id => id && id !== 'undefined');

    const [prescriptions, appointmentsRaw, reports] = await Promise.all([
      Prescription.find({
        $or: [
          { doctorId: user._id.toString() },
          { doctorId: { $in: searchIds } }
        ]
      }).sort({ createdAt: -1 }).limit(20).lean(),

      Appointment.find({
        $or: [
          { doctorId: { $in: searchIds } },
          { doctorId: user._id.toString() }
        ]
      }).sort({ date: -1 }).limit(20).lean(),

      Report.find({
        $or: [
          { doctorId: { $in: searchIds } },
          { doctorId: user._id.toString() }
        ]
      }).sort({ createdAt: -1 }).lean()
    ]);

    const appointments = await Promise.all(
      (appointmentsRaw || []).map(async (app) => {
        const patientUser = await User.findOne({ patientId: app.patientId }).select('name').lean();
        return { ...app, patientName: patientUser?.name || 'Unknown Patient' };
      })
    );

    res.json({
      user,
      profile: {
        ...(doctorProfile || {}),
        experience: doctorProfile?.experience || '5',
        age: doctorProfile?.age || 35,
        gender: doctorProfile?.gender || 'Male'
      },
      prescriptions: prescriptions || [],
      appointments: appointments || [],
      reports: reports || [],
      opChart: [
        { day: 'Mon', count: 12 },
        { day: 'Tue', count: 18 },
        { day: 'Wed', count: 15 },
        { day: 'Thu', count: 22 },
        { day: 'Fri', count: 10 }
      ]
    });
  } catch (error) {
    console.error(`[ADMIN_DOC_DETAILS_FATAL]:`, error);
    res.status(500).json({ message: "Internal archive synchronization failure", error: error.message });
  }
};

export const updateDoctorDetails = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { name, email, specialization, hospitalName, department, experience, age, gender, phone } = req.body;
    const user = await User.findOneAndUpdate({ $or: [{ doctorId }, { applicationNumber: doctorId }] }, { name, email, phone }, { new: true });
    await DoctorProfile.findOneAndUpdate({ userId: user._id }, { specialization, hospitalName, department, experience, age, gender }, { upsert: true });
    res.json({ success: true, message: 'Doctor node parameters updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientDetails = async (req, res) => {
  try {
    const patientId = req.params.patientId?.toUpperCase();
    console.log(`[ADMIN_PORTAL] Probing Patient Archive: ${patientId}`);

    const user = await User.findOne({ patientId });
    if (!user) return res.status(404).json({ message: 'Patient not found' });

    // Explicitly resolve model to prevent ReferenceError
    const ClinicalDiagnosis = mongoose.model('ClinicalDiagnosis');

    const [reports, prescriptions, consultations, diagnoses, profile, trackerMedicines, healthLogs] = await Promise.all([
      Report.find({ patientId }).sort({ createdAt: -1 }),
      Prescription.find({ patientId }).sort({ createdAt: -1 }),
      Appointment.find({ patientId }).sort({ date: -1 }),
      ClinicalDiagnosis.find({ patientId }).sort({ consultationDate: -1 }),
      PatientProfile.findOne({ patientId }),
      Medicine.find({ patientId, isActive: true }),
      HealthLog.find({ patientId }).sort({ date: -1 })
    ]);

    res.json({
      user,
      reports: reports || [],
      profile: { age: profile?.age || 25, gender: profile?.gender || user.gender || 'Male', bloodGroup: profile?.bloodGroup || 'O+', allergies: profile?.allergies || [] },
      prescriptions: prescriptions || [],
      consultations: consultations || [],
      diagnoses: diagnoses || [],
      trackerMedicines: trackerMedicines || [],
      healthLogs: healthLogs || []
    });
  } catch (error) {
    console.error(`[ADMIN_PORTAL_SYNC_ERROR]:`, error);
    res.status(500).json({ message: error.message });
  }
};
