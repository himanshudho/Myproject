const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const subcategoryController = require('../controllers/subcategoryController');

router.post('/', upload.single('image'), subcategoryController.addSubcategory);
router.get('/', subcategoryController.getAllSubcategories); 
router.delete('/:id', subcategoryController.deleteSubcategory); 
router.put('/:id', upload.single('image'), subcategoryController.updateSubcategory); // ✅ Update Subcategory

module.exports = router;
