const express = require("express");
const router = express.Router();
const walletController = require("../controllers/userWalletController");

// ✅ Add money to wallet
router.post("/add", walletController.addMoneyToWallet);

// ✅ Get wallet balance
router.get("/:user_id", walletController.getWalletBalance);

// ✅ Add money to wallet
router.post("/deduct", walletController.deductMoneyToWallet);
module.exports = router;