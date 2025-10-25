const db = require('../config/db');

exports.getAllCategories = (callback) => {
  db.query('SELECT * FROM category', callback);
};

exports.addCategory = (name, image, callback) => {
  const sql = 'INSERT INTO category (name, image) VALUES (?, ?)';
  db.query(sql, [name, image], callback);
};

exports.deleteCategoryById = (id, callback) => {
  db.query('DELETE FROM category WHERE id = ?', [id], callback);
};

exports.getCategoryById = (id, callback) => {
  db.query('SELECT * FROM category WHERE id = ?', [id], callback);
};

exports.updateCategoryById = (id, name, image, callback) => {
  const sql = 'UPDATE category SET name = ?, image = ? WHERE id = ?';
  db.query(sql, [name, image, id], callback);
};
