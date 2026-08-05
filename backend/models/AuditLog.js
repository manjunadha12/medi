import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  logId: { type: String, unique: true },
  userId: { type: String, required: true },
  role: { type: String, required: true },
  action: { type: String, required: true },
  ipAddress: { type: String },
  status: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
