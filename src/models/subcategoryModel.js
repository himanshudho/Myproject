const db = require('../config/db');

exports.addSubcategory = (category_id, name, image, callback) => {
  const sql = 'INSERT INTO subcategory (category_id, name, image) VALUES (?, ?, ?)';
  db.query(sql, [category_id, name, image], callback);
};

exports.getAllSubcategories = (category_id, callback) => {
  let sql = 'SELECT * FROM subcategory';
  let params = [];

  if (category_id) {
    sql += ' WHERE category_id = ?';
    params.push(category_id);
  }

  db.query(sql, params, callback);
};

exports.deleteSubcategoryById = (id, callback) => {
  const sql = 'DELETE FROM subcategory WHERE id = ?';
  db.query(sql, [id], callback);
};

// Update subcategory by ID
exports.updateSubcategoryById = (id, name, image, callback) => {
  const sql = 'UPDATE subcategory SET name = ?, image = ? WHERE id = ?';
  db.query(sql, [name, image, id], callback);
};

// Get subcategory by ID
exports.getSubcategoryById = (id, callback) => {
  const sql = 'SELECT * FROM subcategory WHERE id = ?';
  db.query(sql, [id], callback);
};