
const User = require('../../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Otp = require('../../models/otpModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

async function addNewUser(req, res) {
  const { name, email, password} = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const newUser = new User({ name, email, password: hashedPassword});
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

async function loginuser(req, res) {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

async function getUserDetails(req, res) {
  User.findById(req.user.id)
    .then(user => res.json(user))
    .catch(err => res.status(500).json({ message: 'Error fetching user details', error: err }));
};










module.exports = {addNewUser,loginuser,getUserDetails};

