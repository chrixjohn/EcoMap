const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilepic: { type: String, default: 'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg' },
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;