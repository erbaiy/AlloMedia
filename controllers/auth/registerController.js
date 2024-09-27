


const { registerUser, generateVerificationToken } = require('../../services/authService');
const { sendVerificationEmail } = require('../../helpers/emailHelper');

const register = async (req, res) => {
  try {
    const { username, password, email, roles } = req.body;

    // Register the user (service layer)
    const newUser = await registerUser(username, password, email, roles);

    // Generate verification token
    const verificationToken = generateVerificationToken(newUser._id);

    // Send verification email (helper layer)
    await sendVerificationEmail(newUser.email, verificationToken);

    res.status(201).json({ message: 'User created successfully. Please verify your email.' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error: error.message });
  }
};

module.exports = register;

























// const nodemailer = require('nodemailer');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../model/userModel'); // Adjust this path if needed
// const Role = require('../model/roleModel');

// // Function to create email transporter
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     host: process.env.MAIL_HOST, // You can change this to another email service if required
//     port: process.env.MAIL_PORT,
//     secure: false, // You can change this to another email service if required
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
// };

// const register = async (req, res) => {
//   try {
//     const { username, password, email, roles } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ $or: [{ username }, { email }] });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Username or email already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Find role documents
//     const roleDocuments = await Role.find({ name: { $in: roles } });
//     if (roleDocuments.length !== roles.length) {
//       return res.status(400).json({ message: 'One or more roles are invalid' });
//     }

//     // Create new user
//     const newUser = new User({
//       username,
//       password: hashedPassword,
//       email,
//       roles: roleDocuments.map(role => role._id),
//       isVerified: false,
//     });

//     await newUser.save();

//     // Generate verification token
//     const verificationToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

//     // Create email transporter and send verification email
//     const transporter = createTransporter();
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Email Verification',
//       text: `Please verify your email by clicking this link: 
//       ${process.env.FRONTEND_URL}/register/verify-email?token=${verificationToken}`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(201).json({ message: 'User created successfully. Please verify your email.' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error registering user', error: error.message });
//   }
// };

// module.exports = register;




























// const User = require('../model/userModel');
// const Role = require('../model/roleModel');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const { model } = require('mongoose');

// const register = async (req, res) => {
//   try {
//     const { username, password, email, roles } = req.body;
    
//     // Check if user already exists
//     const existingUser = await User.findOne({ $or: [{ username }, { email }] });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Username or email already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Find role documents
//     const roleDocuments = await Role.find({ name: { $in: roles } });
//     if (roleDocuments.length !== roles.length) {
//       return res.status(400).json({ message: 'One or more roles are invalid' });
//     }

//     // Create new user
//     const newUser = new User({
//       username,
//       password: hashedPassword,
//       email,
//       roles: roleDocuments.map(role => role._id)
//     });

//     await newUser.save();

//     res.status(201).json({ message: 'User created successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error registering user', error: error.message });
//   }
// };


// module.exports =  register ;
