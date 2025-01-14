
const User = require('../../models/expertModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Otp = require('../../models/otpModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');




async function addNewExpert(req, res) {
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

async function loginexpert(req, res) {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const user = await User.findOne({ email });
    
    if (!user) return res.status(401).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    
    
    const token = jwt.sign({ id: user._id , name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '365d' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

async function getExpertDetails(req, res) {
  User.findById(req.user.id)
    .then(user => res.json(user))
    .catch(err => res.status(500).json({ message: 'Error fetching user details', error: err }));
};





async function forgotPassword (req, res) {
  console.log(process.env.EMAIL);
  
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = crypto.randomInt(100000, 999999);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save OTP in database
  await Otp.create({ email, otp, expiresAt });console.log(otp);
  

  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
  port: 587,
  secure: false, // true for 465, false for other ports
    auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error });
  }
};



 async function verifyOtp (req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

  const record = await Otp.findOne({ email, otp });

  if (!record || record.expiresAt < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  // OTP verified, generate reset token
  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });

  res.status(200).json({ message: 'OTP verified', resetToken });
};





 async function resetPassword (req, res) {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) return res.status(400).json({ message: 'Token and password are required' });

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const email = decoded.email;

    // Hash and update the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};




module.exports = {addNewExpert,loginexpert,getExpertDetails,forgotPassword,verifyOtp,resetPassword};

