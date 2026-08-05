import User from '../models/User.js';
import PatientProfile from '../models/PatientProfile.js';
import Prescription from '../models/Prescription.js';

export const getPatientProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`[PROFILE] Fetching profile for ID: ${userId}`);

    const user = await User.findOne({ patientId: userId });

    if (!user) {
      console.log(`[PROFILE] Error: User node not found for ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await PatientProfile.findOne({ userId: user._id });
    console.log(`[PROFILE] Success: Profile synchronized for ${user.name}`);

    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      patientId: user.patientId,
      ...profile?._doc
    });
  } catch (error) {
    console.error(`[PROFILE] Server Error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const updatePatientProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, age, gender, bloodGroup, address, allergies, medicalHistory } = req.body;

    const user = await User.findOneAndUpdate(
      { patientId: userId },
      { name, phone },
      { new: true }
    );

    await PatientProfile.findOneAndUpdate(
      { userId: user._id },
      { age, gender, bloodGroup, address, allergies, medicalHistory },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientPrescriptions = async (req, res) => {
  try {
    const patientId = req.user.patientId;
    if (!patientId) {
      return res.status(400).json({ message: 'User is not registered as a patient.' });
    }
    const prescriptions = await Prescription.find({ patientId }).sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    // Check if patient owns this prescription
    if (prescription.patientId !== req.user.patientId && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this record' });
    }
    await Prescription.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Prescription removed from archive' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
