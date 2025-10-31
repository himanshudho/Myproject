const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const createExpertPost = require('../controllers/expertPostController');


router.post('/', upload.single('image_url'), createExpertPost.createPost);
router.get('/getPost', createExpertPost.getAllPosts);


module.exports = router;
