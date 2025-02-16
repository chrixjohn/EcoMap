const mongoose = require('mongoose');

const occurrenceSchema = new mongoose.Schema({
  spotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Upload', required: true },
  speciesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Species', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', default: null },
},
{timestamps: true});

const Occurrence = mongoose.model('Occurrence', occurrenceSchema);
module.exports = Occurrence;
