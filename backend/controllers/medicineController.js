import Medicine from '../models/Medicine.js';

export const addMedicine = async (req, res) => {
  try {
    const { name, dosage, time, food, days, endDate } = req.body;
    const patientId = req.user.patientId;

    if (!patientId) return res.status(401).json({ message: "Not authorized as patient" });

    const medicine = await Medicine.create({
      patientId,
      name,
      dosage,
      time,
      food,
      days,
      endDate
    });
    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMedicines = async (req, res) => {
  try {
    const { patientId } = req.params;
    const medicines = await Medicine.find({ patientId, isActive: true });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleTaken = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, status } = req.body; // date format: YYYY-MM-DD

    const med = await Medicine.findById(id);
    if (!med) return res.status(404).json({ message: 'Not found' });

    const logIndex = med.takenLogs.findIndex(log => log.date === date);
    if (logIndex > -1) {
      med.takenLogs[logIndex].status = status;
    } else {
      med.takenLogs.push({ date, status });
    }

    await med.save();
    res.json({ success: true, med });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
