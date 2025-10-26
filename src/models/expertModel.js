const db = require('../config/db');

exports.createExpert = (name, email, phone, password, callback) => {
  const sql = 'INSERT INTO experts (name, email, phone, password, status) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, email, phone, password, 1], callback);
};

exports.getAllExperts = (callback) => {
  db.query('SELECT * FROM experts', callback);
};

exports.getExpertById = (id, callback) => {
  db.query('SELECT * FROM experts WHERE id = ?', [id], callback);
};

exports.updateExpertStatus = (id, status, callback) => {
  db.query('UPDATE experts SET status = ? WHERE id = ?', [status, id], callback);
};

// ✅ Update expert status (enable/disable)
exports.updateStatus = (id, status, callback) => {
  const sql = 'UPDATE experts SET status = ? WHERE id = ?';
  db.query(sql, [status, id], callback);
};