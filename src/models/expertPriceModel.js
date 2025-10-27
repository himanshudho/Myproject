const db = require('../config/db');

// ✅ Add or update expert price and questionnaire
exports.addOrUpdatePrice = (data, callback) => {
  const checkSql = "SELECT * FROM expert_prices WHERE expert_id = ?";
  db.query(checkSql, [data.expert_id], (err, result) => {
    if (err) return callback(err);

    if (result.length > 0) {
      // ✅ Update existing record
      const updateSql = `
        UPDATE expert_prices
        SET price_per_minute = ?, reason_for_price = ?, handle_customer = ?, strength = ?, weakness = ?
        WHERE expert_id = ?`;
      const updateValues = [
        data.price_per_minute,
        data.reason_for_price,
        data.handle_customer,
        data.strength,
        data.weakness,
        data.expert_id
      ];
      db.query(updateSql, updateValues, callback);
    } else {
      // ✅ Insert new record
      const insertSql = `
        INSERT INTO expert_prices 
        (expert_id, price_per_minute, reason_for_price, handle_customer, strength, weakness)
        VALUES (?, ?, ?, ?, ?, ?)`;
      const insertValues = [
        data.expert_id,
        data.price_per_minute,
        data.reason_for_price,
        data.handle_customer,
        data.strength,
        data.weakness
      ];
      db.query(insertSql, insertValues, callback);
    }
  });
};

// ✅ Get expert price by expert_id
exports.getExpertPriceById = (expert_id, callback) => {
  const sql = "SELECT * FROM expert_prices WHERE expert_id = ?";
  db.query(sql, [expert_id], callback);
};
