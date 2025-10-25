const Category = require('../models/categoryModel');
const fs = require('fs');
const path = require('path');

// 🔹 Delete category by ID
exports.deleteCategory = (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: 'Category ID is required' });

  // पहले category details ले लो ताकि image delete कर सकें
  Category.getCategoryById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ error: 'Category not found' });

    const category = results[0];
    const imagePath = path.join(__dirname, '../uploads', category.image);

    // database से delete करो
    Category.deleteCategoryById(id, (err, result) => {
      if (err) return res.status(500).json({ error: err });

      // image file delete करो
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      res.json({ message: '✅ Category deleted successfully' });
    });
  });
};

exports.getCategories = (req, res) => {
  Category.getAllCategories((err, results) => {
    if (err) return res.status(500).json({ error: err });

    // ✅ Full image URL include करो
    const updated = results.map(cat => ({
      ...cat,
      image_url: `${req.protocol}://${req.get('host')}/uploads/${cat.image}`
    }));

    res.json(updated);
  });
};

exports.addCategory = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  if (!req.file) return res.status(400).json({ error: 'Image is required' });

  Category.addCategory(name, req.file.filename, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    // ✅ Return full URL for new image
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({
      message: '✅ Category added successfully',
      id: result.insertId,
      name,
      image_url: imageUrl
    });
  });
};

exports.getCategoryById = (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: 'Category ID is required' });

  Category.getCategoryById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ error: 'Category not found' });

    const category = results[0];

    // ✅ Add full image URL
    category.image_url = `${req.protocol}://${req.get('host')}/uploads/${category.image}`;

    res.json(category);
  });
};

exports.updateCategory = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id) return res.status(400).json({ error: 'Category ID is required' });
  if (!name && !req.file)
    return res.status(400).json({ error: 'Nothing to update' });

  // पहले category details ले लो ताकि old image delete कर सके
  Category.getCategoryById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ error: 'Category not found' });

    const category = results[0];
    let newImage = category.image; // default old image

    // अगर new image upload हुई है तो old image delete
    if (req.file) {
      newImage = req.file.filename;
      const oldImagePath = path.join(__dirname, '../uploads', category.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // database update
    Category.updateCategoryById(id, name || category.name, newImage, (err, result) => {
      if (err) return res.status(500).json({ error: err });

      res.json({
        message: '✅ Category updated successfully',
        id,
        name: name || category.name,
        image_url: `${req.protocol}://${req.get('host')}/uploads/${newImage}`
      });
    });
  });
};
