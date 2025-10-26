const ExpertProfile = require('../models/expertProfileModel');

exports.createProfile = (req, res) => {
  try {
    const {
      expert_id,
      name,
      email,
      phone,
      position,
      description,
      category_id,
      subcategory_id,
      education,
      location
    } = req.body;

    // ✅ Handle uploaded files safely
    const profile_photo = req.files['profile_photo']
      ? req.files['profile_photo'][0].filename
      : null;
    const experience_certificate = req.files['experience_certificate']
      ? req.files['experience_certificate'][0].filename
      : null;
    const marksheet = req.files['marksheet']
      ? req.files['marksheet'][0].filename
      : null;
    const aadhar_card = req.files['aadhar_card']
      ? req.files['aadhar_card'][0].filename
      : null;

    // ✅ Basic validation
    if (!expert_id || !name || !email || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Proper data object (same order as DB table)
    const data = {
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
      aadhar_card
    };

    ExpertProfile.createProfile(data, (err, result) => {
      if (err) return res.status(500).json({ error: err });

      // ✅ Generate full URLs for images
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      const responseData = {
        ...data,
        profile_photo: data.profile_photo ? `${baseUrl}/uploads/${data.profile_photo}` : null,
        experience_certificate: data.experience_certificate ? `${baseUrl}/uploads/${data.experience_certificate}` : null,
        marksheet: data.marksheet ? `${baseUrl}/uploads/${data.marksheet}` : null,
        aadhar_card: data.aadhar_card ? `${baseUrl}/uploads/${data.aadhar_card}` : null
      };

      res.json({
        message: "✅ Expert profile created successfully",
        profile_id: result.insertId,
        data: responseData
      });
    });

  } catch (error) {
    console.error("Profile creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.updateProfile = (req, res) => {
  try {
    const profile_id = req.params.id; // ✅ route से id लो

    const {
      expert_id,
      name,
      email,
      phone,
      position,
      description,
      category_id,
      subcategory_id,
      education,
      location
    } = req.body;

    if (!profile_id) {
      return res.status(400).json({ error: "profile_id is required" });
    }

    // Existing profile fetch करो (DB से)
    ExpertProfile.getProfileById(profile_id, (err, existing) => {
      if (err) return res.status(500).json({ error: err });
      if (!existing) return res.status(404).json({ error: "Profile not found" });

      // File handling
      const profile_photo = req.files['profile_photo']
        ? req.files['profile_photo'][0].filename
        : existing.profile_photo;

      const experience_certificate = req.files['experience_certificate']
        ? req.files['experience_certificate'][0].filename
        : existing.experience_certificate;

      const marksheet = req.files['marksheet']
        ? req.files['marksheet'][0].filename
        : existing.marksheet;

      const aadhar_card = req.files['aadhar_card']
        ? req.files['aadhar_card'][0].filename
        : existing.aadhar_card;

      // Updated data
      const data = {
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
        aadhar_card
      };

      // Update DB
      ExpertProfile.updateProfile(profile_id, data, (err) => {
        if (err) return res.status(500).json({ error: err });

        res.json({
          message: "✅ Expert profile updated successfully",
          profile_id,
          data: {
            ...data,
            profile_photo: `${req.protocol}://${req.get('host')}/uploads/${profile_photo}`,
            experience_certificate: `${req.protocol}://${req.get('host')}/uploads/${experience_certificate}`,
            marksheet: `${req.protocol}://${req.get('host')}/uploads/${marksheet}`,
            aadhar_card: `${req.protocol}://${req.get('host')}/uploads/${aadhar_card}`
          }
        });
      });
    });

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getProfileById = (req, res) => {
  const { id } = req.params;

  ExpertProfile.getProfileById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ message: "Profile not found" });

    const profile = results[0];

    // ✅ Make image URLs accessible
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    profile.profile_photo = profile.profile_photo ? baseUrl + profile.profile_photo : null;
    profile.experience_certificate = profile.experience_certificate ? baseUrl + profile.experience_certificate : null;
    profile.marksheet = profile.marksheet ? baseUrl + profile.marksheet : null;
    profile.aadhar_card = profile.aadhar_card ? baseUrl + profile.aadhar_card : null;

    res.json({
      message: "✅ Profile fetched successfully",
      profile
    });
  });
};

exports.getExpertsBySubcategory = (req, res) => {
  const { subcategory_id } = req.params;

  if (!subcategory_id) return res.status(400).json({ error: "Subcategory ID is required" });

  ExpertProfile.getExpertsBySubcategory(subcategory_id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: "No experts found for this subcategory" });

    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;

    const experts = results.map(ex => ({
      ...ex,
      profile_photo: ex.profile_photo ? baseUrl + ex.profile_photo : null,
      experience_certificate: ex.experience_certificate ? baseUrl + ex.experience_certificate : null,
      marksheet: ex.marksheet ? baseUrl + ex.marksheet : null,
      aadhar_card: ex.aadhar_card ? baseUrl + ex.aadhar_card : null
    }));

    res.json({
      message: "✅ Experts fetched successfully",
      experts
    });
  });
};