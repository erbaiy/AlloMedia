const jwt = require('jsonwebtoken');
const User = require('../../model/userModel'); // Adjust this path if needed

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    // Decode token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token has expired
    if (Date.now() >= decoded.exp * 1000) {
      return res.status(400).json({ message: 'Verification link has expired' });
    }

    // Find the user based on decoded token's userId
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Check if the email is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying email', error: error.message });
  }
};

module.exports = verifyEmail;
















// // verificationController.js
// const User = require('../model/userModel');
// const jwt = require('jsonwebtoken');

// const verifyEmail = async (req, res) => {
//   const { token } = req.query;

//   if (!token) {
//     return res.status(400).json({ message: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId);

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid token' });
//     }

//     user.isVerified = true; // Set the user as verified
//     await user.save();

//     res.status(200).json({ message: 'Email verified successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error verifying email', error: error.message });
//   }
// };

// module.exports = verifyEmail;
