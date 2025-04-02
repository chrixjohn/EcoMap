const User = require("../../models/userModel");
const occurrence = require("../../models/occurenceModel");
const expert = require("../../models/expertModel");
const species = require("../../models/speciesModel");
const upload = require("../../models/uploadModel");

const countAllDocuments = async (req, res) => {
  try {
    const models = { User, occurrence, expert, species, upload };
    const counts = {};

    for (const [key, model] of Object.entries(models)) {
      try {
        counts[key] = await model.countDocuments();
      } catch (error) {
        console.error(`Error counting ${key}:`, error.message);
        counts[key] = { error: `Error counting ${key}` };
      }
    }

    res.json(counts);
  } catch (error) {
    console.error("Unexpected error:", error.message);
    res.status(500).json({ message: "Error counting documents", error });
  }
};

module.exports = { countAllDocuments };
