import ReferralDoctor from '../models/ReferralDoctor.js';
import Referral from '../models/Referral.js';
import User from '../models/User.js';

// Get all patients (for patient list dropdown)
export const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('name patientId email phone');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- REFERRAL DOCTORS CRUD ---

// Get all referral doctors
export const getReferralDoctors = async (req, res) => {
  try {
    const doctors = await ReferralDoctor.find().sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add referral doctor
export const addReferralDoctor = async (req, res) => {
  try {
    const { name, specialization, hospitalName, contactNumber, email, address, availabilityStatus } = req.body;

    // Auto-generate Doctor ID sequentially (e.g. DOC1001)
    const lastDoc = await ReferralDoctor.findOne().sort({ createdAt: -1 });
    let nextNum = 1001;
    if (lastDoc && lastDoc.doctorId) {
      const match = lastDoc.doctorId.match(/\d+/);
      if (match) {
        nextNum = parseInt(match[0], 10) + 1;
      }
    }
    const doctorId = `DOC${nextNum}`;

    const newDoc = new ReferralDoctor({
      doctorId,
      name,
      specialization,
      hospitalName,
      contactNumber,
      email,
      address,
      availabilityStatus: availabilityStatus || 'Available'
    });

    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit referral doctor
export const updateReferralDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ReferralDoctor.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Referral doctor not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete referral doctor
export const deleteReferralDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ReferralDoctor.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Referral doctor not found' });
    res.json({ message: 'Referral doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- REFERRALS MANAGEMENT ---

// Get all referrals & stats
export const getReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find().sort({ createdAt: -1 });
    
    const stats = {
      total: referrals.length,
      pending: referrals.filter(r => r.status === 'Pending').length,
      accepted: referrals.filter(r => r.status === 'Accepted').length,
      completed: referrals.filter(r => r.status === 'Completed').length,
      cancelled: referrals.filter(r => r.status === 'Cancelled').length
    };

    res.json({ referrals, stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new patient referral
export const createReferral = async (req, res) => {
  try {
    const { patientId, referredDoctorId, referralReason, diagnosis, notes, recommendations, priority } = req.body;

    // Find Patient name
    const patientUser = await User.findOne({ patientId });
    if (!patientUser) return res.status(400).json({ message: `Patient with ID ${patientId} not found` });

    // Find Referred Doctor name
    const refDoctor = await ReferralDoctor.findOne({ doctorId: referredDoctorId });
    if (!refDoctor) return res.status(400).json({ message: `Referral Doctor with ID ${referredDoctorId} not found` });

    // Auto-generate Referral ID sequentially (e.g. REF1001)
    const lastRef = await Referral.findOne().sort({ createdAt: -1 });
    let nextNum = 1001;
    if (lastRef && lastRef.referralId) {
      const match = lastRef.referralId.match(/\d+/);
      if (match) {
        nextNum = parseInt(match[0], 10) + 1;
      }
    }
    const referralId = `REF${nextNum}`;

    // Referring Doctor is the logged-in doctor
    const referringDoctorId = req.user._id.toString();
    const referringDoctorName = req.user.name;

    const newReferral = new Referral({
      referralId,
      patientId,
      patientName: patientUser.name,
      referredDoctorId,
      referredDoctorName: refDoctor.name,
      referringDoctorId,
      referringDoctorName,
      referralReason,
      diagnosis,
      notes,
      recommendations,
      priority: priority || 'Normal',
      status: 'Pending'
    });

    await newReferral.save();

    // Trigger mock notification simulation:
    console.log(`[NOTIFICATION] Alert sent to referred doctor ${refDoctor.name} (${refDoctor.email}) regarding new referral ${referralId}.`);

    res.status(201).json(newReferral);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update referral status
export const updateReferralStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Accepted', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid referral status' });
    }

    const updated = await Referral.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Referral not found' });

    // Trigger mock notification simulation:
    console.log(`[NOTIFICATION] Status update for referral ${updated.referralId}: Status changed to ${status}. Notification sent to referring doctor ID: ${updated.referringDoctorId}.`);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
