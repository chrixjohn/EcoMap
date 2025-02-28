
const User = require('../../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Otp = require('../../models/otpModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cloudinary = require('../../config/cloudinary');
const { log } = require('console');

async function addNewUser(req, res) {
  const { name, email, password } = req.body;

  // Validate inputs
  if (!name) {
    return res.status(401).json({ message: 'Name is required.' });
  }
  
  if (!email) {
    return res.status(401).json({ message: 'Email is required.' });
  }
  
  if (!password) {
    return res.status(401).json({ message: 'Password is required.' });
  }
  

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(401).json({ message: 'Invalid email format.' });
  }

  // Validate password strength
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
  if (!passwordRegex.test(password)) {
    return res.status(401).json({
      message: 'Password must be at least 8 characters long and include at least one letter and one number.',
    });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: 'Email is already registered.' });
    }

    // Create and save the new user
    const newUser = new User({ name, email, password: hashedPassword, status:'pending' });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
}


async function loginuser(req, res) {
  const { email, password } = req.body;
  console.log(req.body);
  
  if (!email) {
    return res.status(401).json({ message: 'Email is required.' });
  }
  
  if (!password) {
    return res.status(401).json({ message: 'Password is required.' });
  }

  try {
    const user = await User.findOne({ email });
    
    if (!user) return res.status(401).json({ message: 'User not found' });
    if ( user.status == 'pending') {
      return res.status(403).json({ message: 'User account is not approved.' });
    }
    if (user.status == 'rejected') {
      return res.status(403).json({ message: 'User account is rejected.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    
    
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role:"user"}, process.env.JWT_SECRET, { expiresIn: '365d' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

async function getUserDetails(req, res) {
  try {
    const user = await User.findById(req.user.id).select('_id name email profilepic');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user details', error: err.message });
  }
}

async function updateUser(req, res) {
  try {
    
    const { name, email, password } = req.body;
    const user = req.user; // Retrieved from middleware

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const updates = {};

    // Validate and add name if provided
    if (name) {
      updates.name = name;
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
      }
      updates.email = email;
    }

    // Validate and hash password if provided
    if (password) {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message: 'Password must be at least 8 characters long and include at least one letter and one number.',
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    // Update profile picture using Cloudinary if provided
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'userprofile' },
          (error, result) => {
            if (error) {
              reject(new Error('Error uploading image'));
            } else {
              resolve(result);
            }
          }
        );
        stream.end(req.file.buffer); // Send file buffer to Cloudinary
      });
      updates.profilepic = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, updates, { new: true, runValidators: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message || error });
  }
}

// Delete user
async function deleteUser(req, res) {
  try {
    
    const user = req.user; // Retrieved from middleware
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
    
    const deletedUser = await User.findByIdAndDelete(user.id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    // Validate email input
    if (!email) {
      return res.status(401).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'User not found' });

    // Generate OTP and expiration time
    const otp = crypto.randomInt(100000, 999999); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Save OTP in database
    await Otp.create({ email, otp, expiresAt });
    console.log(process.env.EMAIL_PASSWORD,process.env.EMAIL)

    // Configure the mail transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
        
      },
    });

    // Email content
    const mailOptions = {
      from: `"Eco Map" <${process.env.EMAIL}>`,
      to: email,
      subject: 'EcoMap: Password Reset OTP',
      html: `
          <html>
              <body style="font-family: Arial, sans-serif; background-color: #f4f7fc; padding: 20px;">
                  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                      <h2 style="color: #333333; text-align: center;">Eco Map - Password Reset</h2>
                      <p style="font-size: 16px; color: #333333;">Hello User,</p>
                      <p style="font-size: 16px; color: #333333;">We received a request to reset your password. Please use the following OTP to reset it:</p>
                      <div style="text-align: center; margin: 20px 0;">
                          <h3 style="font-size: 24px; color: white; background-color: #4CAF50; font-weight: bold; padding: 10px 30px; border-radius: 5px; display: inline-block; letter-spacing: 10px;">
                              ${otp}
                          </h3>
                      </div>
                      <p style="font-size: 16px; color: #333333;">The OTP is valid for <strong>10 minutes</strong>.</p>
                      <p style="font-size: 16px; color: #333333;">If you didn't request a password reset, please ignore this email.</p>
                      <div style="text-align: center; margin-top: 30px;">
                          <p style="font-size: 14px; color: #888888;">&copy; 2025 Eco Map. All rights reserved.</p>
                      </div>
                  </div>
              </body>
          </html>
      `,
  };
  
  
    // Send the email
    const mail=await transporter.sendMail(mailOptions);
    console.log(mail);
    

    // Respond with success message
    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Error processing your request', error });
  }
}


 async function verifyOtp (req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) return res.status(401).json({ message: 'Email and OTP are required' });

  const record = await Otp.findOne({ email, otp });

  if (!record || record.expiresAt < Date.now()) {
    return res.status(401).json({ message: 'Invalid or expired OTP' });
  }

  // OTP verified, generate reset token
  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });

  res.status(200).json({ message: 'OTP verified', resetToken });
};





 async function resetPassword (req, res) {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) return res.status(401).json({ message: 'Token and password are required' });

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








module.exports = {addNewUser,loginuser,getUserDetails,updateUser,deleteUser,forgotPassword,verifyOtp,resetPassword};

