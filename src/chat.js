// chat.js
const mysql = require('mysql2/promise');

module.exports = function (io) {
  const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'problemsolve'
  });

  const activeChats = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', async ({ user_id, expert_id }) => {
      try {
        const room_id = `room_${user_id}_${expert_id}`;

        const [priceRows] = await db.query('SELECT price_per_minute FROM expert_prices WHERE expert_id = ?', [expert_id]);
        if (priceRows.length === 0) return socket.emit('error', 'Expert price not found');

        const pricePerMinute = parseFloat(priceRows[0].price_per_minute);

        const [walletRows] = await db.query('SELECT balance FROM user_wallet WHERE user_id = ?', [user_id]);
        if (walletRows.length === 0) return socket.emit('error', 'User wallet not found');

        let balance = parseFloat(walletRows[0].balance);

        if (balance < pricePerMinute) {
          return socket.emit('error', 'Insufficient balance, please recharge.');
        }

        socket.join(room_id);

        await db.query(
          'INSERT INTO chat_sessions (room_id, user_id, expert_id, start_time, is_active) VALUES (?, ?, ?, NOW(), 1)',
          [room_id, user_id, expert_id]
        );

        socket.emit('message', '💬 Chat started successfully.');
        io.to(room_id).emit('chat_started', { room_id });

        const interval = setInterval(async () => {
          const [walletData] = await db.query('SELECT balance FROM user_wallet WHERE user_id = ?', [user_id]);
          balance = parseFloat(walletData[0].balance);

          if (balance < pricePerMinute) {
            clearInterval(interval);
            await db.query(
              'UPDATE chat_sessions SET end_time = NOW(), duration_minutes = TIMESTAMPDIFF(MINUTE, start_time, NOW()), is_active = 0 WHERE room_id = ?',
              [room_id]
            );
            io.to(room_id).emit('chat_ended', '⚠️ Chat ended due to low balance. Please recharge.');
            io.socketsLeave(room_id);
            return;
          }

          await db.query(
            'UPDATE user_wallet SET balance = balance - ?, last_transaction_amount = ?, last_transaction_type = "debit", updated_at = NOW() WHERE user_id = ?',
            [pricePerMinute, pricePerMinute, user_id]
          );

          console.log(`💰 Deducted ${pricePerMinute} from user ${user_id}`);
        }, 60 * 1000);

        activeChats.set(room_id, interval);
      } catch (err) {
        console.error(err);
        socket.emit('error', 'Server error.');
      }
    });

    socket.on('sendMessage', async ({ room_id, sender_id, sender_type, message }) => {
      try {
        const [session] = await db.query(
          'SELECT id FROM chat_sessions WHERE room_id = ? AND is_active = 1',
          [room_id]
        );

        if (session.length === 0) return socket.emit('error', 'No active chat session found');

        const session_id = session[0].id;

        await db.query(
          'INSERT INTO chat_messages (session_id, sender_type, sender_id, message, created_at) VALUES (?, ?, ?, ?, NOW())',
          [session_id, sender_type, sender_id, message]
        );

        io.to(room_id).emit('message', {
          sender_type,
          sender_id,
          message,
          time: new Date()
        });
      } catch (err) {
        console.error(err);
        socket.emit('error', 'Failed to send message.');
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
