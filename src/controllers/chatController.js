const ChatModel = require('../models/chatModel');

exports.getChatDetails = (req, res) => {
  const room_id = req.params.room_id;

  if (!room_id) {
    return res.status(400).json({ success: false, message: 'room_id is required' });
  }

  ChatModel.getChatWithMessages(room_id, (err, chatData) => {
    if (err) {
      console.error('❌ Error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (!chatData) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }

    res.status(200).json({ success: true, data: chatData });
  });
};

exports.getMessagesByUserId = (req, res) => {
  const userId = req.params.user_id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  ChatModel.getMessagesByUserId(userId, (err, results) => {
    if (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No messages found for this user' });
    }

    res.status(200).json({
      success: true,
      messages: results
    });
  });
};
