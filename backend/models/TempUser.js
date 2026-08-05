import mongoose from 'mongoose';

const tempUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  password: { type: String, required: true },
  emailOtp: { type: String },
  phoneOtp: { type: String },
  emailOtpExpires: { type: Date },
  phoneOtpExpires: { type: Date },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  sendChannel: { type: String, default: 'both' },
  lastOtpSentAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now, expires: 600 } // TTL index: auto delete after 10 minutes
});

const TempUser = mongoose.model('TempUser', tempUserSchema);
export default TempUser;
