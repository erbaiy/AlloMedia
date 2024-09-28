const jwt = require('jsonwebtoken');
const User = require('../../model/userModel');
const { sendOtpEmail } = require('../../services/emailService');
const { generateOtp } = require('../../services/authService');

const rsetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body; // OTP and newPassword should be in the body
        const { token } = req.params; // Token from URL params (if needed for password reset)

        // Verify the JWT token from the reset link
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!tokenDecoded) {
            return res.status(400).send('Invalid or expired token');
        }

        // Find the user by email or token
        const user = await User.findOne({ email: tokenDecoded.email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();
        

        res.status(200).send('Password updated successfully');
    } catch (error) {
        return res.status(400).json({ message: 'Error resetting password', error: error.message });
    }
};

module.exports = rsetPassword;
