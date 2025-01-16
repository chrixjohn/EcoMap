
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilepic: { type: String, default: null },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
