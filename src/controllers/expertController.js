const Expert = require('../models/expertModel');
const bcrypt = require('bcrypt');

exports.createExpert = async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password)
    return res.status(400).json({ error: 'All fields are required' });

  const hashedPassword = await bcrypt.hash(password, 10);

  Expert.createExpert(name, email, phone, hashedPassword, (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json({ message: '✅ Expert registered successfully', id: result.insertId });
  });
};

exports.getAllExperts = (req, res) => {
  Expert.getAllExperts((err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results);
  });
};

exports.getExpertById = (req, res) => {
  const { id } = req.params;
  Expert.getExpertById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    if (results.length === 0) return res.status(404).json({ message: 'Expert not found' });
    res.json(results[0]);
  });
};

exports.updateExpertStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 1 = enable, 0 = disable
  Expert.updateExpertStatus(id, status, (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json({ message: `✅ Expert status updated to ${status === 1 ? 'Enabled' : 'Disabled'}` });
  });
};

// ✅ Update expert status (enable/disable)
exports.updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status === undefined)
    return res.status(400).json({ error: 'Status is required (0 or 1)' });

  Expert.updateStatus(id, status, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Expert not found' });

    res.json({ message: '✅ Expert status updated successfully', id, status });
  });
};