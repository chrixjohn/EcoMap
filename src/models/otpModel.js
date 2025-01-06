// models/Otp.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
});

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;
