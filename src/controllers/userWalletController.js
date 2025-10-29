const walletModel = require("../models/userWalletModel");

// ✅ Add Money to Wallet
exports.addMoneyToWallet = async (req, res) => {
  try {
    const { user_id, amount } = req.body;

    if (!user_id || !amount || amount <= 0) {
      return res.status(400).json({ message: "Valid user_id and amount required" });
    }

    // Check wallet
    let wallet = await walletModel.getWalletByUserId(user_id);

    // If wallet doesn't exist, create one
    if (!wallet) {
      await walletModel.createWallet(user_id);
      wallet = { balance: 0 };
    }

    const newBalance = parseFloat(wallet.balance) + parseFloat(amount);

    await walletModel.updateWallet(user_id, newBalance, amount, "credit");

    return res.status(200).json({
      message: "Money added successfully",
      user_id,
      new_balance: newBalance,
    });
  } catch (err) {
    console.error("Error adding money:", err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};



// ✅ Deduct Money to Wallet
exports.deductMoneyToWallet = async (req, res) => {
  try {
    const { user_id, amount } = req.body;

    if (!user_id || !amount || amount <= 0) {
      return res.status(400).json({ message: "Valid user_id and amount required" });
    }

    // Check wallet
    let wallet = await walletModel.getWalletByUserId(user_id);

    // If wallet doesn't exist, create one
    if (!wallet) {
      await walletModel.deductWallet(user_id);
      wallet = { balance: 0 };
    }

    const newBalance = parseFloat(wallet.balance) - parseFloat(amount);

    await walletModel.updateWallet(user_id, newBalance, amount, "debit");

    return res.status(200).json({
      message: "Money Deduct successfully",
      user_id,
      new_balance: newBalance,
    });
  } catch (err) {
    console.error("Error adding money:", err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};



// ✅ Get Wallet Balance
exports.getWalletBalance = async (req, res) => {
  try {
    const { user_id } = req.params;

    const wallet = await walletModel.getWalletByUserId(user_id);
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    res.status(200).json({
      user_id,
      balance: wallet.balance,
      last_transaction_amount: wallet.last_transaction_amount,
      last_transaction_type: wallet.last_transaction_type,
      updated_at: wallet.updated_at,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching wallet", error: err });
  }
};
