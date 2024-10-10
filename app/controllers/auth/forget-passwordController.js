const jwt = require('jsonwebtoken');
const User = require('../../model/userModel');
const {sendVerificationEmail} = require('../../helpers/emailHelper'); // Import the email helper function
const { generateOtp } = require('../../services/authService'); // Destructure if it's a named export

const forgetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Await the user lookup
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        // generate a token with short time
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '5m' });            
        await sendVerificationEmail(user.email, token,"forgetPassword"); // Send the token to the user's email

        return res.status(200).json({
            message: 'token sent to your email. Please verify.',
        });
    } catch (error) {
        // Handle specific error messages if needed
        if (error.message === 'Unauthorized') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.status(400).json({ message: 'Error sending token', error: error.message });
    }
};

module.exports = forgetPassword;



