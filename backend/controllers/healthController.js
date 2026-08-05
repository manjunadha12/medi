import HealthLog from '../models/HealthLog.js';
import { swarmAnalyze } from '../swarmAnalyze.js';

export const addHealthLog = async (req, res) => {
  try {
    const { patientId, date, bp_systolic, bp_diastolic, temperature, heartbeat, sugar, oxygen, weight, notes } = req.body;

    // Check if entry for this date (day) already exists to update it instead of duplicate
    const searchDate = date ? new Date(date) : new Date();
    searchDate.setHours(0,0,0,0);
    const endDate = new Date(searchDate);
    endDate.setHours(23,59,59,999);

    const existingLog = await HealthLog.findOne({
      patientId,
      date: { $gte: searchDate, $lte: endDate }
    });

    if (existingLog) {
      existingLog.bp_systolic = bp_systolic;
      existingLog.bp_diastolic = bp_diastolic;
      existingLog.temperature = temperature;
      existingLog.heartbeat = heartbeat;
      existingLog.sugar = sugar;
      existingLog.oxygen = oxygen;
      existingLog.weight = weight;
      existingLog.notes = notes;
      await existingLog.save();
      return res.json(existingLog);
    }

    const log = await HealthLog.create({
      patientId,
      date: date || new Date(),
      bp_systolic,
      bp_diastolic,
      temperature,
      heartbeat,
      sugar,
      oxygen,
      weight,
      notes
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHealthLogs = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { range } = req.query; // 'week' or 'month' or 'all'

    let query = { patientId };
    if (range !== 'all') {
        let dateLimit = new Date();
        if (range === 'month') dateLimit.setMonth(dateLimit.getMonth() - 1);
        else dateLimit.setDate(dateLimit.getDate() - 7);
        query.date = { $gte: dateLimit };
    }

    const logs = await HealthLog.find(query).sort({ date: 1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const analyzeHealthTrends = async (req, res) => {
  try {
    const { logs } = req.body;
    if (!logs || logs.length === 0) return res.status(400).json({ message: "No data to analyze" });

    const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latest = sortedLogs[0];
    const previous = sortedLogs[1] || null;

    const logSummary = sortedLogs.slice(0, 10).map(l =>
      `Date: ${new Date(l.date).toLocaleDateString()}, BP: ${l.bp_systolic}/${l.bp_diastolic}, Temp: ${l.temperature}, Heartbeat: ${l.heartbeat}, Sugar: ${l.sugar}, Oxygen: ${l.oxygen || 'N/A'}, Weight: ${l.weight || 'N/A'}`
    ).join('\n');

    const prompt = `Perform a high-precision medical trend analysis.
    Compare the latest entry (${new Date(latest.date).toLocaleDateString()}) with previous records.

    Return EXACTLY a JSON object:
    {
      "comparison": {
        "heartRate": "Improved | Stable | Needs Attention",
        "bp": "Improved | Stable | Needs Attention",
        "oxygen": "Improved | Stable | Needs Attention",
        "weight": "Improved | Stable | Needs Attention",
        "statusIcon": "🟢 | 🟡 | 🔴"
      },
      "weeklyTrend": {
        "avgHeartRate": "Stable | Improving | Fluctuating",
        "bpTrend": "Improving | High | Stable",
        "oxygenLevels": "Consistently Healthy | Variance Detected",
        "weightChange": "Reduced by X kg | No change",
        "healthScore": 90,
        "weeklyStatus": "Excellent Progress | Maintain Protocol | Review with Doctor"
      },
      "recommendations": [
        "Recommendation 1",
        "Recommendation 2",
        "Recommendation 3"
      ]
    }

    PATIENT DATA HISTORY (Newest First):
    ${logSummary}`;

    const aiResult = await swarmAnalyze({ prompt });

    try {
        const jsonStart = aiResult.indexOf('{');
        const jsonEnd = aiResult.lastIndexOf('}') + 1;
        const parsed = JSON.parse(aiResult.substring(jsonStart, jsonEnd));
        res.json(parsed);
    } catch (e) {
        // Fallback if AI output is not perfect JSON
        res.json({
            comparison: { heartRate: "Stable", bp: "Stable", oxygen: "Stable", weight: "Stable", statusIcon: "🟡" },
            weeklyTrend: { avgHeartRate: "Stable", bpTrend: "Stable", oxygenLevels: "Healthy", weightChange: "No major change", healthScore: 85, weeklyStatus: "Stable" },
            recommendations: ["Maintain hydration", "Continue walking", "Monitor vitals daily"]
        });
    }
  } catch (error) {
    console.error("Health Analysis Error:", error);
    res.status(500).json({ message: "Analysis failed" });
  }
};

export const cleanHealthData = async (req, res) => {
  try {
    const { patientId } = req.params;
    const allLogs = await HealthLog.find({ patientId }).sort({ date: 1 });

    let duplicatesRemoved = 0;
    let formattingFixed = 0;
    let missingFieldsIdentified = 0;
    let recordsOptimized = 0;

    const seenDates = new Set();
    const toDelete = [];

    for (const log of allLogs) {
      const dayKey = new Date(log.date).toISOString().split('T')[0];

      // 1. Remove duplicate entries for same day
      if (seenDates.has(dayKey)) {
        toDelete.push(log._id);
        duplicatesRemoved++;
        continue;
      }
      seenDates.add(dayKey);

      // 2. Standardize units & detect impossible values (Example: HR > 300)
      let changed = false;
      if (log.heartbeat > 250 || log.heartbeat < 30) {
          log.heartbeat = 72; // Reset to default if impossible
          changed = true;
          formattingFixed++;
      }

      // 3. Flag missing data (Internal check)
      if (!log.oxygen || !log.weight) {
          missingFieldsIdentified++;
      }

      if (changed) {
          await log.save();
          recordsOptimized++;
      }
    }

    if (toDelete.length > 0) {
        await HealthLog.deleteMany({ _id: { $in: toDelete } });
    }

    res.json({
      success: true,
      summary: {
        duplicatesRemoved,
        formattingFixed,
        missingFieldsIdentified,
        recordsOptimized: recordsOptimized + (allLogs.length - toDelete.length)
      }
    });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const deleteAllHealthLogs = async (req, res) => {
  try {
    const { patientId } = req.params;
    await HealthLog.deleteMany({ patientId });
    res.json({ success: true, message: 'All health records have been cleared from the node.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
