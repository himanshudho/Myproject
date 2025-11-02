const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/details/:room_id', chatController.getChatDetails);
router.get('/messages/:user_id', chatController.getMessagesByUserId);
module.exports = router;
