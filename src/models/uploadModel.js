const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uploadSchema = new Schema({
  image: { type: String, required: true },
  title: { type: String, required: true},
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  status: { type: String, enum: ['approved', 'waiting', 'declined'], default: 'waiting' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
});

uploadSchema.pre('findOneAndDelete', async function(next) {
  try {
    const upload = await this.model.findOne(this.getQuery());
    if (upload) {
      await mongoose.model('Occurrence').deleteMany({ spotId: upload._id });
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Upload = mongoose.model('Upload', uploadSchema);
module.exports = Upload;
