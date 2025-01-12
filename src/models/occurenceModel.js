const mongoose = require('mongoose');

const occurrenceSchema = new mongoose.Schema({
  spotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Upload', required: true },
  //name: { type: String, required: true },
  //img: { type: String, default: null },
  speciesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Species', required: true },
  //scientificname: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  //username: { type: String, required: true },
  //date: { type: Date, default: Date.now },
  //location: { type: String, required: true },
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', default: null },
  //expertname: { type: String, default: null },
});

const Occurrence = mongoose.model('Occurrence', occurrenceSchema);
module.exports = Occurrence;
