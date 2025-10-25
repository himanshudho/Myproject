const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', upload.single('image'), categoryController.addCategory);
router.delete('/:id', categoryController.deleteCategory);
router.put('/:id', upload.single('image'), categoryController.updateCategory);

module.exports = router;
