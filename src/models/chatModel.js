const { callbackify } = require('util');
const db = require('../config/db');

exports.getMessagesByUserId = (userId, callback) => {
  const sql = `
     SELECT cm.id, cm.message, cm.sender_id, cm.sender_type, cm.created_at, 
             cs.room_id, cs.expert_id, cs.user_id
      FROM chat_messages cm
      JOIN chat_sessions cs ON cm.session_id = cs.id
      WHERE cs.user_id = ?
      ORDER BY cm.created_at ASC
  `;
  db.query(sql, [userId], callback);
};


exports.getChatWithMessages = (room_id, callback) => {
  // Get session
  db.query(
    `SELECT id, user_id, expert_id, start_time, end_time, duration_minutes, is_active 
     FROM chat_sessions WHERE room_id = ?`,
    [room_id],
    (err, sessionRows) => {
      if (err) return callback(err, null);
      if (sessionRows.length === 0) return callback(null, null);

      const session = sessionRows[0];

      // Get messages
      db.query(
        `SELECT sender_type, sender_id, message, created_at 
         FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC`,
        [session.id],
        (err2, messages) => {
          if (err2) return callback(err2, null);

          callback(null, { session, messages });
        }
      );
    }
  );
};
