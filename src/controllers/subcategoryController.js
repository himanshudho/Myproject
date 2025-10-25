const Subcategory = require('../models/subcategoryModel');
const Category = require('../models/categoryModel'); // need to check if category exists
const fs = require('fs');
const path = require('path');

exports.addSubcategory = (req, res) => {
  const { category_id, name } = req.body;

  if (!category_id) return res.status(400).json({ error: 'Category ID is required' });
  if (!name) return res.status(400).json({ error: 'Subcategory name is required' });

  // ✅ Check if category exists
  Category.getCategoryById(category_id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) {
      return res.status(400).json({ error: 'Category ID does not exist' });
    }

    let imageFile = req.file ? req.file.filename : null;

    Subcategory.addSubcategory(category_id, name, imageFile, (err, result) => {
      if (err) return res.status(500).json({ error: err });

      const imageUrl = imageFile
        ? `${req.protocol}://${req.get('host')}/uploads/${imageFile}`
        : null;

      res.json({
        message: '✅ Subcategory added successfully',
        id: result.insertId,
        category_id,
        name,
        image_url: imageUrl
      });
    });
  });
};


exports.getAllSubcategories = (req, res) => {
  const { category_id } = req.query; // optional filter by category

  Subcategory.getAllSubcategories(category_id, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    // Add full image URL
    const data = results.map(sub => ({
      ...sub,
      image_url: sub.image
        ? `${req.protocol}://${req.get('host')}/uploads/${sub.image}`
        : null
    }));

    res.json(data);
  });
};


exports.deleteSubcategory = (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: 'Subcategory ID is required' });

  // पहले image delete करने के लिए subcategory fetch करें
  Subcategory.getAllSubcategories(null, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    const subcategory = results.find(sub => sub.id == id);
    if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });

    // अगर image है तो delete कर दो
    if (subcategory.image) {
      const imagePath = path.join(__dirname, '../uploads', subcategory.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    // अब database से delete करो
    Subcategory.deleteSubcategoryById(id, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: '✅ Subcategory deleted successfully' });
    });
  });
};


exports.updateSubcategory = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id) return res.status(400).json({ error: 'Subcategory ID is required' });
  if (!name) return res.status(400).json({ error: 'Subcategory name is required' });

  // Step 1: Fetch existing subcategory
  Subcategory.getSubcategoryById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: 'Subcategory not found' });

    const existing = results[0];
    let newImage = existing.image; // default old image

    // Step 2: If new image uploaded, delete old image
    if (req.file) {
      newImage = req.file.filename;
      if (existing.image) {
        const oldImagePath = path.join(__dirname, '../uploads', existing.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
    }

    // Step 3: Update subcategory
    Subcategory.updateSubcategoryById(id, name, newImage, (err, result) => {
      if (err) return res.status(500).json({ error: err });

      const imageUrl = newImage
        ? `${req.protocol}://${req.get('host')}/uploads/${newImage}`
        : null;

      res.json({
        message: '✅ Subcategory updated successfully',
        id,
        name,
        image_url: imageUrl
      });
    });
  });
};






