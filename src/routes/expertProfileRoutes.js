const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const expertProfileController = require('../controllers/expertProfileController');

// ✅ Multiple file upload configuration (same for create and update)
const multipleUpload = upload.fields([
  { name: 'profile_photo', maxCount: 1 },
  { name: 'experience_certificate', maxCount: 1 },
  { name: 'marksheet', maxCount: 1 },
  { name: 'aadhar_card', maxCount: 1 }
]);

// 🟢 Create Expert Profile
router.post('/', multipleUpload, expertProfileController.createProfile);

// 🟠 Update Expert Profile
router.put('/:id', multipleUpload, expertProfileController.updateProfile);

// 🟠 get Expert Profile
router.get('/:id', expertProfileController.getProfileById);

// Get experts by subcategory
router.get('/subcategory/:subcategory_id', expertProfileController.getExpertsBySubcategory);

module.exports = router;
