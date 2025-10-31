const express = require('express');
const router = express.Router();
const followerController = require('../controllers/expertFollowerController');

// Follow
router.post('/follow', followerController.followExpert);

// Unfollow
router.post('/unfollow', followerController.unfollowExpert);

// Get all followers for expert
router.get('/:expert_id/followers', followerController.getFollowers);

module.exports = router;
