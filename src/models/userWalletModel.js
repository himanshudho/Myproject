const db = require("../config/db");

// ✅ Get wallet by user_id
exports.getWalletByUserId = async (user_id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM user_wallet WHERE user_id = ?", [user_id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

// ✅ Create wallet for user (if not exists)
exports.createWallet = async (user_id) => {
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO user_wallet (user_id, balance) VALUES (?, 0)", [user_id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });``
};

// ✅ Create wallet for user (if not exists)
exports.deductWallet = async (user_id) => {
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO user_wallet (user_id, balance) VALUES (?, 0)", [user_id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });``
};



// ✅ Update wallet balance
exports.updateWallet = async (user_id, newBalance, amount, type) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE user_wallet SET balance = ?, last_transaction_amount = ?, last_transaction_type = ? WHERE user_id = ?",
      [newBalance, amount, type, user_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};




