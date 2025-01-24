
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uploadSchema = new Schema({
  image: { type: String, required: true },
  title: { type: String, required: true},
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  //photos: { type: [String], default: [] },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  status: { type: String, enum: ['approved', 'waiting'], default: 'waiting' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
});

const Upload = mongoose.model('Upload', uploadSchema);
module.exports = Upload;
