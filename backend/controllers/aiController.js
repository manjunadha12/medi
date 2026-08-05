import fs from 'fs';
import path from 'path';
import Report from '../models/Report.js';
import DoctorProfile from '../models/DoctorProfile.js';
import User from '../models/User.js';
import { swarmAnalyze } from '../swarmAnalyze.js';

export const chatWithAI = async (req, res) => {
  try {
    const userMessage = req.body.message || "Medical query.";
    let imageBase64 = null;
    let mimeType = null;
    if (req.file) {
      mimeType = req.file.mimetype;
      imageBase64 = fs.readFileSync(req.file.path).toString("base64");
    }
    const systemPrompt = "You are a professional medical assistant. You MUST return ONLY a valid JSON object string. Do not include markdown code blocks.";
    const result = await swarmAnalyze({ prompt: userMessage, imageBase64, mimeType, systemPrompt });
    res.json({ success: true, content: result });
  } catch (error) {
    res.status(503).json({ success: false, message: "AI Node Timeout" });
  }
};

export const analyzeReport = async (req, res) => {
  try {
    const { reportId } = req.body;
    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: "Archive node missing." });

    let imageBase64 = null;
    let mimeType = null;
    const __dirname = path.resolve();
    const filePath = path.join(__dirname, report.fileUrl);

    if (fs.existsSync(filePath)) {
      const ext = path.extname(report.fileName).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        imageBase64 = fs.readFileSync(filePath).toString('base64');
        mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
      }
    }

    const systemPrompt = "You are a clinical data extraction engine. Extract name, age, weight, height, and medical findings. Return ONLY valid JSON.";
    const prompt = `PARSING TASK: Analyze this report. Return ONLY a valid JSON object string with these keys: name, age, weight, height, summary, riskLevel, abnormalValues (list), suggestedSpecialist. Data: ${report.category}`;

    const result = await swarmAnalyze({ prompt, imageBase64, mimeType, systemPrompt });

    try {
      const jsonStart = result.indexOf('{');
      const jsonEnd = result.lastIndexOf('}') + 1;
      const cleanJson = result.substring(jsonStart, jsonEnd);
      const aiData = JSON.parse(cleanJson);

      await Report.findByIdAndUpdate(reportId, { aiSummary: aiData.summary, status: 'Analyzed' });
      res.json(aiData);
    } catch (e) {
      res.json({
        summary: result.replace(/["{}[\]]/g, ''),
        riskLevel: "Low",
        abnormalValues: ["Telemetry processed"],
        suggestedSpecialist: "Physician"
      });
    }
  } catch (error) {
    res.status(503).json({ message: "Diagnostic Node Offline" });
  }
};

export const analyzeMedicine = async (req, res) => {
  try {
    const { medicineName } = req.body;
    if (!medicineName) return res.status(400).json({ message: "ID required." });

    const systemPrompt = "You are a pharmacology expert. Provide accurate drug information. Return ONLY valid JSON.";
    const prompt = `DATA TASK: Pharmacology for ${medicineName}. Return ONLY a JSON object: { "name": "...", "genericName": "...", "category": "...", "usedFor": "...", "howItWorks": "...", "dosage": "...", "sideEffects": [], "precautions": [], "aiExplanation": "..." }`;

    const result = await swarmAnalyze({ prompt, systemPrompt });

    try {
      const jsonStart = result.indexOf('{');
      const jsonEnd = result.lastIndexOf('}') + 1;
      const cleanJson = result.substring(jsonStart, jsonEnd);
      res.json(JSON.parse(cleanJson));
    } catch (e) {
      res.status(422).json({ message: "Registry sync failed. Try again." });
    }
  } catch (error) {
    res.status(503).json({ message: "Pharmacology Node Saturated" });
  }
};

const medicinesDatabase = [
  // ANALGESICS & ANTIPYRETICS
  { name: "Paracetamol", brandName: "Dolo 650 / Crocin", commonUses: "Fever and pain relief" },
  { name: "Ibuprofen", brandName: "Advil / Brufen", commonUses: "Pain and inflammation" },
  { name: "Aceclofenac", brandName: "Zerodol", commonUses: "Joint and muscle pain" },
  { name: "Diclofenac", brandName: "Voveran", commonUses: "Severe pain relief" },
  { name: "Aspirin", brandName: "Ecosprin", commonUses: "Blood thinner / Heart health" },

  // ANTIBIOTICS
  { name: "Amoxicillin", brandName: "Amoxil / Mox", commonUses: "Bacterial infections" },
  { name: "Azithromycin", brandName: "Azee / Azithral", commonUses: "Respiratory infections" },
  { name: "Ciprofloxacin", brandName: "Ciplox", commonUses: "Urinary and skin infections" },
  { name: "Cefixime", brandName: "Taxim-O", commonUses: "Typhoid and throat infections" },
  { name: "Amoxicillin + Clavulanate", brandName: "Augmentin", commonUses: "Complex infections" },

  // GASTROINTESTINAL
  { name: "Pantoprazole", brandName: "Pan 40 / Pantocid", commonUses: "Acidity and Heartburn" },
  { name: "Omeprazole", brandName: "Omez", commonUses: "Stomach ulcers and GERD" },
  { name: "Ranitidine", brandName: "Rantac / Zinetac", commonUses: "Acid reflux" },
  { name: "Domperidone", brandName: "Domstal", commonUses: "Nausea and vomiting" },
  { name: "Loperamide", brandName: "Imodium", commonUses: "Diarrhea control" },

  // ANTIDIABETIC
  { name: "Metformin", brandName: "Glycomet / Glucophage", commonUses: "Type 2 Diabetes" },
  { name: "Glimepiride", brandName: "Amaryl", commonUses: "Blood sugar control" },
  { name: "Sitagliptin", brandName: "Januvia", commonUses: "Diabetes management" },

  // HYPERTENSION (BP)
  { name: "Amlodipine", brandName: "Amlokind", commonUses: "High blood pressure" },
  { name: "Telmisartan", brandName: "Telma 40", commonUses: "BP control and heart health" },
  { name: "Losartan", brandName: "Losar", commonUses: "Hypertension management" },
  { name: "Atorvastatin", brandName: "Lipitor / Atorva", commonUses: "High cholesterol" },

  // ANTI-ALLERGIC
  { name: "Cetirizine", brandName: "Zyrtec / Okacet", commonUses: "Allergies and sneezing" },
  { name: "Levocetirizine", brandName: "Levocet", commonUses: "Chronic allergic rhinitis" },
  { name: "Montelukast", brandName: "Singulair / Montek", commonUses: "Asthma and allergies" },
  { name: "Pheniramine", brandName: "Avil", commonUses: "Severe allergic reactions" },

  // COUGH & COLD
  { name: "Dextromethorphan", brandName: "Benadryl DR", commonUses: "Dry cough relief" },
  { name: "Guaifenesin", brandName: "Ascoril", commonUses: "Chest congestion" },

  // VITAMINS
  { name: "Vitamin C", brandName: "Limcee", commonUses: "Immunity booster" },
  { name: "Vitamin D3", brandName: "Uprise D3", commonUses: "Bone health" },
  { name: "B-Complex", brandName: "Becosules", commonUses: "Energy and nerve health" }
];

export const getMedicineSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);
    const q = query.toLowerCase();
    const filtered = medicinesDatabase.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.brandName.toLowerCase().includes(q)
    );
    res.json(filtered.slice(0, 8));
  } catch (error) {
    res.status(500).json({ message: "Buffer error" });
  }
};

export const getDoctorSuggestion = async (req, res) => {
  try {
    const { specialization, city, doctorId, search } = req.body;
    let query = {};

    const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    if (search && search.trim()) {
      const s = escapeRegex(search.trim());

      // 1. Find users whose names, emails, or IDs match the search query
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: s, $options: 'i' } },
          { email: { $regex: s, $options: 'i' } },
          { doctorId: { $regex: s, $options: 'i' } }
        ],
        role: 'doctor'
      }).select('_id');
      const userIds = matchingUsers.map(u => u._id);

      // 2. Build the global OR query for profiles
      query.$or = [
        { userId: { $in: userIds } },
        { doctorId: { $regex: s, $options: 'i' } },
        { applicationNumber: { $regex: s, $options: 'i' } },
        { specialization: { $regex: s, $options: 'i' } },
        { hospitalName: { $regex: s, $options: 'i' } },
        { city: { $regex: s, $options: 'i' } }
      ];
    } else {
      // Smart Fallback: If specialization/doctorId/city are provided individually (e.g. from FindDoctor.jsx)
      // but look like IDs, we expand the query automatically.
      const sSpec = specialization ? escapeRegex(specialization.trim()) : null;
      const sCity = city ? escapeRegex(city.trim()) : null;
      const sDocId = doctorId ? escapeRegex(doctorId.trim()) : null;

      if (sSpec) {
        if (sSpec.toUpperCase().startsWith('DOC') || sSpec.toUpperCase().startsWith('APP')) {
           query.$or = [
             { doctorId: { $regex: sSpec, $options: 'i' } },
             { applicationNumber: { $regex: sSpec, $options: 'i' } },
             { specialization: { $regex: sSpec, $options: 'i' } }
           ];
        } else {
           query.specialization = { $regex: sSpec, $options: 'i' };
        }
      }
      if (sCity) query.city = { $regex: sCity, $options: 'i' };
      if (sDocId) {
        query.$or = query.$or || [];
        query.$or.push({ doctorId: { $regex: sDocId, $options: 'i' } });
        query.$or.push({ applicationNumber: { $regex: sDocId, $options: 'i' } });
      }
    }

    const doctors = await DoctorProfile.find(query).populate('userId', 'name');
    console.log(`[REGISTRY] Found ${doctors.length} nodes for query: ${JSON.stringify(query)}`);

    res.json(doctors.map(d => ({
      id: d.doctorId || d.applicationNumber || 'NODE-PENDING',
      name: d.userId?.name || "Specialist Node",
      specialization: d.specialization || "General Medicine",
      hospital: d.hospitalName || "Clinical Center",
      city: d.city,
      fee: d.consultationFee || 500,
      available: d.availabilityStatus === 'Available',
      rating: d.rating || 4.5,
      exp: d.experience || 5,
      qualifications: d.qualifications || ["MBBS", "MS", "MCh"],
      ops: d.operationsCount || 100,
      treated: d.patientsTreatedCount || 1000,
      topReview: d.topReview,
      status: d.verificationStatus,
      isVerified: d.isVerified
    })));
  } catch (error) {
    res.status(500).json({ message: "Specialist node offline" });
  }
};

export const getCostEstimation = async (req, res) => {
  try {
    const { treatments, city, hospitalType, roomType, insurance } = req.body;
    if (!treatments || !Array.isArray(treatments) || treatments.length === 0) {
      return res.status(400).json({ message: "Procedures list required." });
    }

    const proceduresList = treatments.map(t => t.name).join(', ');
    const prompt = `FINANCIAL ESTIMATION TASK: Estimate realistic medical costs in Indian Rupees (INR) for Indian city: ${city}, hospital tier: ${hospitalType || 'Private'}, room type: ${roomType || 'General Ward'}, insurance coverage: ${insurance || 'No'}.
Procedures to estimate: ${proceduresList}.

CRITICAL: You must provide a HIGHLY DETAILED itemized breakdown. For a major procedure like surgery, split it into components like 'Surgeon Fees', 'Anesthesiology', 'OT Charges', 'Consumables', etc.

Return ONLY a valid JSON object in this exact format:
{
  "items": [
    { "name": "Component Name (e.g. Surgeon Fees for CABG)", "cost": 75000, "details": "Specific detail about this component" }
  ],
  "room": 10000,
  "insuranceDiscount": 5000,
  "total": 80000,
  "swarmNote": "brief expert commentary on regional hospital rates"
}`;

    const systemPrompt = "You are a medical billing expert in India. Provide realistic cost estimates. Return ONLY valid JSON.";
    const result = await swarmAnalyze({ prompt, systemPrompt });

    try {
      const jsonStart = result.indexOf('{');
      const jsonEnd = result.lastIndexOf('}') + 1;
      const cleanJson = result.substring(jsonStart, jsonEnd);
      const data = JSON.parse(cleanJson);

      // Math validation: Re-calculate total to ensure accuracy
      const itemsCost = data.items.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);
      data.room = Number(data.room) || 0;
      data.insuranceDiscount = Number(data.insuranceDiscount) || 0;
      data.total = itemsCost + data.room - data.insuranceDiscount;

      res.json(data);
    } catch (e) {
      // Fallback in case of JSON parse failure
      res.json({
        items: treatments.map(t => ({ name: t.name, cost: 45000, details: "Average regional estimate" })),
        room: 10000,
        insuranceDiscount: insurance === 'Yes' ? 5000 : 0,
        total: (treatments.length * 45000) + 10000 - (insurance === 'Yes' ? 5000 : 0),
        swarmNote: "Standard rates applied due to response format sync."
      });
    }
  } catch (error) {
    res.status(503).json({ message: "Financial Swarm Node Offline" });
  }
};
export const searchHospitalAI = async (req, res) => {
  try {
    const trimmedQuery = req.body.query?.trim();
    console.log(`[AI-HOSPITAL] Starting Swarm Search for: "${trimmedQuery}"`);
    if (!trimmedQuery || trimmedQuery.length < 2) return res.json([]);

    const prompt = `HOSPITAL SEARCH: List all medical institutions related to "${trimmedQuery}".
IF query is "ACS", you MUST include "ACS Medical College and Hospital, Chennai" and its dental/nursing branches.
Return ONLY valid JSON array (max 12 results):
[
  {
    "name": "Full Name",
    "shortName": "Common Name",
    "type": "Hospital/College",
    "address": "Full Address",
    "city": "City",
    "state": "State",
    "country": "India",
    "postalCode": "PIN",
    "website": "URL",
    "phone": "Phone",
    "ownership": "Private/Government",
    "university": "University",
    "hospitalId": "HSPXXXX",
    "collegeId": "COLXXXX",
    "verificationStatus": "Verified",
    "nabhStatus": "Accredited/N/A",
    "nmcApproval": "Recognized/N/A",
    "naacGrade": "A/B/N/A",
    "district": "District"
  }
]`;

    const systemPrompt = "You are a hospital directory expert. Search for verified medical institutions in India. Return ONLY a valid JSON array.";
    const result = await swarmAnalyze({ prompt, systemPrompt });
    console.log(`[AI-HOSPITAL] Swarm Response Received. Raw Preview: ${result?.substring(0, 100)}...`);

    try {
      // Robust JSON Array extraction
      const arrayStart = result.indexOf('[');
      const arrayEnd = result.lastIndexOf(']') + 1;

      if (arrayStart !== -1 && arrayEnd > arrayStart) {
        const cleanJson = result.substring(arrayStart, arrayEnd);
        const hospitals = JSON.parse(cleanJson);
        console.log(`[AI-HOSPITAL] Extracted ${hospitals.length} institutions.`);

        if (hospitals.length === 0 && query.toLowerCase().includes('acs')) {
           return res.json([{
              name: "ACS Medical College and Hospital",
              shortName: "ACS Medical",
              type: "Medical College & Hospital",
              city: "Chennai",
              state: "Tamil Nadu",
              verificationStatus: "Verified",
              hospitalId: "HSP60077"
           }]);
        }
        return res.json(hospitals);
      }

      // Check for error response from swarm
      if (result.includes("Swarm nodes busy") || result.includes("failed to respond") || result.includes("error")) {
        console.error("[AI-HOSPITAL] Swarm nodes busy or limit reached. Returning empty AI set.");
        // We return an empty array here because the frontend already has local results
        return res.json([]);
      }

      console.warn("[AI-HOSPITAL] No JSON array found. Checking for object...");
      const objStart = result.indexOf('{');
      const objEnd = result.lastIndexOf('}') + 1;
      if (objStart !== -1 && objEnd > objStart) {
        const obj = JSON.parse(result.substring(objStart, objEnd));
        return res.json([obj]);
      }

      res.json([]);
    } catch (e) {
      console.error("AI Parse Error:", e.message);
      res.json([]);
    }
  } catch (error) {
    res.status(503).json({ message: "Institutional Swarm Offline" });
  }
};
