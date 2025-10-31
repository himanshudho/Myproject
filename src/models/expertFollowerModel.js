const db = require('../config/db');

exports.followExpert = (user_id, expert_id, callback) => {
  const sql = 'INSERT INTO expert_followers (user_id, expert_id) VALUES (?, ?)';
  db.query(sql, [user_id, expert_id], callback);
};

exports.unfollowExpert = (user_id, expert_id, callback) => {
  const sql = 'DELETE FROM expert_followers WHERE user_id = ? AND expert_id = ?';
  db.query(sql, [user_id, expert_id], callback);
};

exports.getFollowersByExpert = (expert_id, callback) => {
  const sql = `
    SELECT u.id, u.first_name, u.last_name, u.email, u.phone, f.created_at
    FROM expert_followers f
    JOIN users u ON f.user_id = u.id
    WHERE f.expert_id = ?;
  `;
  db.query(sql, [expert_id], callback);
};
