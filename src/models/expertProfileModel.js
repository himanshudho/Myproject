const db = require('../config/db');

exports.createProfile = (data, callback) => {
  const sql = `
    INSERT INTO expert_profiles 
    (expert_id, name, email, phone, position,description, category_id, subcategory_id, education, location, profile_photo, experience_certificate, marksheet, aadhar_card)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;
  const values = [
    data.expert_id,
    data.name,
    data.email,
    data.phone,
    data.position,
    data.description,
    data.category_id,
    data.subcategory_id,
    data.education,
    data.location,
    data.profile_photo,
    data.experience_certificate,
    data.marksheet,
    data.aadhar_card
  ];

  db.query(sql, values, callback);
};

exports.getProfileById = (id, callback) => {
  const sql = `
    SELECT 
      id, 
      expert_id, 
      name, 
      email, 
      phone, 
      position, 
      description, 
      category_id, 
      subcategory_id, 
      education, 
      location, 
      profile_photo, 
      experience_certificate, 
      marksheet, 
      aadhar_card,
      created_at
    FROM expert_profiles
    WHERE id = ?
  `;
  db.query(sql, [id], callback);
};

// 🟠 Update Expert Profile
exports.updateProfile = (id, data, callback) => {
  const sql = `
    UPDATE expert_profiles 
    SET 
      expert_id = ?,
      name = ?,
      email = ?,
      phone = ?,
      position = ?,
      description = ?,
      category_id = ?,
      subcategory_id = ?,
      education = ?,
      location = ?,
      profile_photo = ?,
      experience_certificate = ?,
      marksheet = ?,
      aadhar_card = ?
    WHERE id = ?
  `;

  const values = [
    data.expert_id,
    data.name,
    data.email,
    data.phone,
    data.position,
    data.description,
    data.category_id,
    data.subcategory_id,
    data.education,
    data.location,
    data.profile_photo,
    data.experience_certificate,
    data.marksheet,
    data.aadhar_card,
    id
  ];

  db.query(sql, values, callback);
};


exports.getExpertsBySubcategory = (subcategory_id, callback) => {

  const sql = `
    SELECT ep.*, e.name AS expert_name 
    FROM expert_profiles ep
    JOIN experts e ON ep.expert_id = e.id
    WHERE ep.subcategory_id = ? AND e.status = 0
  `;

  db.query(sql, [subcategory_id], callback);
  
};
