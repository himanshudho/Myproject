const express = require('express');
const router = express.Router();
const expertController = require('../controllers/expertController');

router.post('/', expertController.createExpert);
router.get('/', expertController.getAllExperts);
router.get('/:id', expertController.getExpertById);
router.put('/:id/status', expertController.updateExpertStatus);
router.put('/:id/status', expertController.updateStatus);

module.exports = router;