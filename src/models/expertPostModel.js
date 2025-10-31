const db = require('../config/db');

exports.createPost = (expert_id, title, description,image_url, callback) => {
  const sql = 'INSERT INTO expert_posts  (expert_id, title, description, image_url) VALUES (?, ?, ?,?)';
  db.query(sql, [expert_id, title, description,image_url], callback);
};


exports.getAllPosts = (expert_id, callback) => {
  let sql = 'SELECT * FROM expert_posts';
  const params = [];

  if (expert_id) {
    sql += ' WHERE expert_id = ?';
    params.push(expert_id);
  }

  sql += ' ORDER BY id DESC'; // ✅ Sort by id in descending order
  db.query(sql, params, callback);
};