const mongoose = require('mongoose');

const speciesSchema = new mongoose.Schema({
  common_name: { type: String, required: true },
  scientific_name: { type: String, required: true },
  taxonomy_class: { type: String, default: null },
  conservation_status: { type: String, default: null },
});

const Species = mongoose.model('Species', speciesSchema);
module.exports = Species;
