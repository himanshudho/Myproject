const createExpertPost = require('../models/expertPostModel');
const fs = require('fs');
const path = require('path');


exports.createPost = (req, res) => {
  const { title } = req.body;
  const {expert_id} = req.body;
  const {description} = req.body;

  if (!title) return res.status(400).json({ error: 'title is required' });
  if (!req.file) return res.status(400).json({ error: 'Image is required' });

  createExpertPost.createPost(expert_id, title, description, req.file.filename, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    // ✅ Return full URL for new image
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({
      message: '✅ Post added successfully',
      id: result.insertId,
      title,
      description,
      expert_id,
      image_url: imageUrl
    });
  });
};


exports.getAllPosts = (req, res) => {
  const { expert_id } = req.query; // Optional filter

  createExpertPost.getAllPosts(expert_id, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    // ✅ Add full URL for image_url
    const data = results.map(post => ({
      ...post,
      image_url: post.image_url
        ? `${req.protocol}://${req.get('host')}/uploads/${post.image_url}`
        : null
    }));

    // ✅ Sort posts by ID descending (latest first)
    data.sort((a, b) => b.id - a.id);

    res.json({
      message: "✅ All posts fetched successfully",
      total: data.length,
      posts: data
    });
  });
};
