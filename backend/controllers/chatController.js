import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const humanId = req.user.doctorId || req.user.patientId;

    // 1. Get existing conversations
    let conversations = await Conversation.find({
      'participants.userId': userId
    }).sort({ updatedAt: -1 });

    // Patch humanId for older conversations if missing
    conversations = await Promise.all(conversations.map(async (c) => {
      const conv = c.toObject();
      for (let p of conv.participants) {
        if (!p.humanId) {
          const u = await User.findById(p.userId);
          p.humanId = u?.doctorId || u?.patientId || u?.adminId;
        }
      }
      return conv;
    }));

    // 2. Find appointments that don't have a conversation yet
    const existingApptIds = conversations.map(c => c.appointmentId?.toString()).filter(id => id);

    if (!humanId) {
      return res.json(conversations); // Return early if no humanId (e.g. admin or invalid user)
    }

    // Make humanId search case-insensitive for more robust node matching
    const potentialAppointments = await Appointment.find({
      $or: [
        { doctorId: { $regex: new RegExp(`^${humanId}$`, 'i') } },
        { patientId: { $regex: new RegExp(`^${humanId}$`, 'i') } }
      ],
      status: { $in: ['Accepted', 'Pending', 'Live'] },
      _id: { $nin: existingApptIds },
      chatDismissed: { $ne: true }
    });

    // 3. Map potential appointments to a compatible conversation format (Grouped by Partner)
    const seenPartners = new Set();
    const potentialChats = [];

    for (const appt of potentialAppointments) {
      const targetHumanId = (appt.doctorId?.toLowerCase() === humanId.toLowerCase()) ? appt.patientId : appt.doctorId;
      if (!targetHumanId || seenPartners.has(targetHumanId)) continue;

      const targetUser = await User.findOne({
        $or: [
          { doctorId: { $regex: new RegExp(`^${targetHumanId}$`, 'i') } },
          { patientId: { $regex: new RegExp(`^${targetHumanId}$`, 'i') } }
        ]
      });

      potentialChats.push({
        _id: `temp_${appt._id}`,
        isPotential: true,
        isLocked: appt.status === 'Pending',
        appointmentId: appt._id,
        participants: [
          { userId, humanId, name: req.user.name, role: req.user.role },
          {
            userId: targetUser?._id,
            humanId: targetHumanId,
            name: targetUser?.name || `Specialist ${targetHumanId}`,
            role: targetUser?.role || (targetHumanId.startsWith('DOC') ? 'doctor' : 'patient')
          }
        ],
        lastMessage: {
          text: appt.status === 'Pending' ? 'Awaiting Specialist Approval' : 'Clinical Link Authorized - Initialize Chat',
          timestamp: appt.updatedAt
        }
      });

      seenPartners.add(targetHumanId);
    }

    res.json([...conversations, ...potentialChats]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // If it's a temporary ID for a potential chat, return empty array instead of failing
    if (conversationId.startsWith('temp_')) {
      return res.json([]);
    }

    const { limit = 50, skip = 0 } = req.query;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('replyTo');

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text, type, metadata, replyTo, receiverId } = req.body;
    const senderId = req.user._id;

    // Resolve receiverId if it's a DOC/PAT string ID
    let resolvedReceiverId = receiverId;
    if (typeof receiverId === 'string' && (receiverId.startsWith('DOC') || receiverId.startsWith('PAT'))) {
      const targetUser = await User.findOne({
        $or: [{ doctorId: receiverId }, { patientId: receiverId }]
      });
      if (targetUser) resolvedReceiverId = targetUser._id;
    }

    // Check if attachments are provided via multer (not implemented yet in this route, but placeholder)
    const attachments = req.files ? req.files.map(file => ({
      url: `/uploads/chat/${file.filename}`,
      name: file.originalname,
      size: file.size,
      fileType: file.mimetype
    })) : [];

    const message = new Message({
      conversationId,
      senderId,
      text,
      type,
      attachments,
      metadata,
      replyTo
    });

    await message.save();

    // Update conversation last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        text: type === 'text' ? text : `Sent a ${type}`,
        senderId,
        timestamp: new Date()
      }
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const startConversation = async (req, res) => {
  try {
    let { targetUserId, appointmentId } = req.body;
    const currentUserId = req.user._id;

    // Resolve targetUserId if it's a DOC/PAT string ID
    if (typeof targetUserId === 'string' && (targetUserId.startsWith('DOC') || targetUserId.startsWith('PAT') || targetUserId.startsWith('ADM'))) {
      const targetUser = await User.findOne({
        $or: [
          { doctorId: targetUserId },
          { patientId: targetUserId },
          { adminId: targetUserId }
        ]
      });
      if (!targetUser) return res.status(404).json({ message: "Target user node not found" });
      targetUserId = targetUser._id;
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      'participants.userId': { $all: [currentUserId, targetUserId] },
      appointmentId
    });

    if (conversation) {
      return res.json(conversation);
    }

    const participantsData = await User.find({
      _id: { $in: [currentUserId, targetUserId] }
    });

    const conversationData = {
      participants: participantsData.map(u => ({
        userId: u._id,
        humanId: u.doctorId || u.patientId || u.adminId,
        role: u.role,
        name: u.name,
        avatar: u.profilePic || ''
      })),
      appointmentId
    };

    conversation = new Conversation(conversationData);
    await conversation.save();

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Skip if it's a temporary ID
    if (conversationId.startsWith('temp_')) {
      return res.json({ success: true });
    }

    const userId = req.user._id;

    await Message.updateMany(
      { conversationId, senderId: { $ne: userId }, status: { $ne: 'read' } },
      { $set: { status: 'read' } }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    await Conversation.findByIdAndDelete(conversationId);
    await Message.deleteMany({ conversationId });
    res.json({ success: true, message: "Neural link purged successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const dismissPotentialChat = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    await Appointment.findByIdAndUpdate(appointmentId, { chatDismissed: true });
    res.json({ success: true, message: "Potential link dismissed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
