
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uploadSchema = new Schema({
  image: { type: String, required: true },
  title: { type: String, required: true},
  description: { type: String, required: true },
  location: { type: String, required: true },
  
});

const Upload = mongoose.model('Upload', uploadSchema);
module.exports = Upload;
