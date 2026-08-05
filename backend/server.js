import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import reportRoutes from './routes/reports.js';
import doctorRoutes from './routes/doctors.js';
import adminRoutes from './routes/admin.js';
import patientRoutes from './routes/patients.js';
import medicineRoutes from './routes/medicines.js';
import healthRoutes from './routes/health.js';
import appointmentRoutes from './routes/appointments.js';
import referralRoutes from './routes/referrals.js';
import chatRoutes from './routes/chat.js';
import diagnosisRoutes from './routes/diagnosis.js';

// MediConsult Node Initialization

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Log ALL requests
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url} from ${req.ip}`);
  if (req.method === 'POST') console.log('Body:', req.body);
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Route - Trigger Nodemon Restart
app.get('/', (req, res) => {
  res.json({
    message: "MediConsult Neural Backend Operational",
    status: "online",
    node: req.ip
  });
});

// Routes
app.use('/api/clinical-diagnosis', diagnosisRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/chat', chatRoutes);

// Socket.IO Logic for Real-time Communication
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("register-user", (userId) => {
    socket.join(userId);
    console.log(`User registered in personal room: ${userId}`);
  });

  socket.on("join-room", ({ roomCode, userId, userName }) => {
    socket.join(roomCode);
    console.log(`${userName} joined room: ${roomCode}`);
    socket.to(roomCode).emit("user-joined", { userId, userName, socketId: socket.id });
  });

  // Global Chat Events
  socket.on("chat-message", (data) => {
    // data: { conversationId, senderId, receiverId, text, type, attachments, ... }
    const { receiverId } = data;
    io.to(receiverId).emit("new-chat-message", data);
  });

  socket.on("typing", ({ conversationId, senderId, receiverId, isTyping }) => {
    io.to(receiverId).emit("user-typing", { conversationId, senderId, isTyping });
  });

  socket.on("message-read", ({ conversationId, senderId, receiverId }) => {
    io.to(receiverId).emit("messages-seen", { conversationId, senderId });
  });

  socket.on("call-user", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("call-made", { signal: signalData, from, name, fromSocketId: socket.id });
  });

  socket.on("answer-call", (data) => {
    io.to(data.to).emit("call-accepted", data.signal);
  });

  socket.on("send-message", ({ roomCode, message, sender }) => {
    io.to(roomCode).emit("receive-message", { message, sender, timestamp: new Date() });
  });

  socket.on("toggle-audio", ({ roomCode, userId, enabled }) => {
    socket.to(roomCode).emit("user-audio-toggled", { userId, enabled });
  });

  socket.on("toggle-video", ({ roomCode, userId, enabled }) => {
    socket.to(roomCode).emit("user-video-toggled", { userId, enabled });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`MediConsult Server active on port ${PORT}`);
});
