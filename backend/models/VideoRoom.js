import mongoose from 'mongoose';

const videoRoomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  participants: [{
    userId: String,
    role: String,
    joinedAt: Date
  }],
  callStatus: { type: String, enum: ['active', 'ended'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  endedAt: { type: Date }
});

const VideoRoom = mongoose.model('VideoRoom', videoRoomSchema);
export default VideoRoom;
