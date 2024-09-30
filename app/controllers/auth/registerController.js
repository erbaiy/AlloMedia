


const { registerUser, generateVerificationToken } = require('../../services/authService');
const { sendVerificationEmail } = require('../../helpers/emailHelper');

const register = async (req, res) => {
  try {
    const { username, password, email, roles } = req.body;

    
    const newUser = await registerUser(username, password, email, roles);
    console.log(newUser);

    // Generate verification token
    const verificationToken = generateVerificationToken(newUser._id);

    // Send verification email (helper layer)
    await sendVerificationEmail(newUser.email, verificationToken, 'verifyEmail');

    res.status(201).json({ message: 'User created successfully. Please verify your email.' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error: error.message });
  }
};

module.exports = register;























