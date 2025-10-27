const ExpertPrice = require('../models/expertPriceModel');

// ✅ Create or Update Price and Questions
exports.addOrUpdatePrice = (req, res) => {
  try {
    const {
      expert_id,
      price_per_minute,
      reason_for_price,
      handle_customer,
      strength,
      weakness
    } = req.body;

    if (!expert_id || !price_per_minute) {
      return res.status(400).json({ error: "expert_id and price_per_minute are required" });
    }

    const data = {
      expert_id,
      price_per_minute,
      reason_for_price,
      handle_customer,
      strength,
      weakness
    };

    ExpertPrice.addOrUpdatePrice(data, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "✅ Expert price & details saved successfully" });
    });

  } catch (error) {
    console.error("Expert price update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get Expert Price by ID
exports.getExpertPriceById = (req, res) => {
  try {
    const { expert_id } = req.params;

    ExpertPrice.getExpertPriceById(expert_id, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.length === 0) return res.status(404).json({ message: "No price info found for this expert" });
      res.json(result[0]);
    });
  } catch (error) {
    console.error("Get expert price error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
