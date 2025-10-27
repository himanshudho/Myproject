const express = require('express');
const router = express.Router();
const expertPriceController = require('../controllers/expertPriceController');

// ✅ Create or update expert price
router.post('/', expertPriceController.addOrUpdatePrice);

// ✅ Get expert price by expert_id
router.get('/:expert_id', expertPriceController.getExpertPriceById);

module.exports = router;
