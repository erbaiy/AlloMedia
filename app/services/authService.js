// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const Role = require('../model/roleModel');
const bcrypt = require('bcrypt');

const crypto = require('crypto');
const { tr } = require('date-fns/locale');

// const { sendOtpEmail } = require('./emailService');


// Function to register a new user
const registerUser = async (username, password, email, roles) => {
  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new Error('Username or email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Find roles
  const roleDocuments = await Role.find({ name: { $in: roles } });
  if (roleDocuments.length !== roles.length) {
    throw new Error('One or more roles are invalid');
  }

  // Create new user
  const newUser = new User({
    username,
    password: hashedPassword,
    email,
    roles: roleDocuments.map(role => role._id),
    isVerified: false,
  });

  await newUser.save();

  return newUser;
};

// Function to generate a verification token
const generateVerificationToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};




const handleLogin = async (email, password) => {
    if (!email || !password) {
        throw new Error('Email and password are required.');
    }
    const foundUser = await User.findOne({ email });

    if (!foundUser || !foundUser.isVerified === true) {
        throw new Error('Unauthorized'); // User not found
    }
    // Compare passwords
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
        throw new Error('Unauthorized'); // Password doesn't match
    }
    // Save refresh token in the user database
    await foundUser.save();
    // Return the tokens and the user data
    return {user: foundUser };
};

const generateOtp = async (userId) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 10); // 10 minutes expiry

  const user = await User.findById(userId);
  if (!user) {
      throw new Error('User not found');
  }
  user.otp = otp;
  user.otpExpiration = expirationTime;
  await user.save();
  return otp;
};

const validateOtp = async (email, otp) => {
  const user = await User.findOne({ email });

  if (!user) {
    console.error('User not found for email:', email);
    throw new Error('User not found');
  }
  console.log('User found:', user);

  if (!user.otp || user.otp !== otp) {
    console.error('Invalid OTP. Expected:', user.otp, 'Received:', otp);
    throw new Error('Invalid OTP');
  }

  if (!user.otpExpiration || user.otpExpiration < new Date()) {
    console.error('OTP expired. Expiration time:', user.otpExpiration, 'Current time:', new Date());
    throw new Error('OTP expired');
  }

  // Clear OTP after successful validation
  user.otp = null;
  user.otpExpiration = null;

  await user.save().catch(error => {
    console.error('Error saving user:', error);
    throw new Error('Error saving user');
  });

  console.log('User saved successfully');
  return true; // OTP is valid
};


module.exports = {
  registerUser,
  generateVerificationToken,
  handleLogin,generateOtp, validateOtp 
};
