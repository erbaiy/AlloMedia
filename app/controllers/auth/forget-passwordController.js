const jwt = require('jsonwebtoken');
const User = require('../../model/userModel');
const {sendOtpEmail} = require('../../services/emailService');
const { generateOtp } = require('../../services/authService'); // Destructure if it's a named export

const forgetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Await the user lookup
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        // Generate jwt and send it to the user's email
        const generateJWTtoken =jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    


        
        await sendOtpEmail(user.email, generateJWTtoken);


        // Notify user to check their email for the OTP
        return res.status(200).json({
            message: 'OTP sent to your email. Please verify.',
            // accessToken can be included if applicable, otherwise omit it
        });
    } catch (error) {
        // Handle specific error messages if needed
        if (error.message === 'Unauthorized') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.status(400).json({ message: 'Error sending OTP', error: error.message });
    }
};

module.exports = forgetPassword;




// const express = require('express');
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');

// const router = express.Router();

// // Mock database
// const users = [
//     { id: 1, email: 'user@example.com', password: 'password123', resetToken: null, resetTokenExpiry: null }
// ];

// // Nodemailer setup (use your own SMTP settings)
// const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         user: 'your-email@gmail.com',
//         pass: 'your-email-password'
//     }
// });

// // Forget Password
// router.post('/forget-password', (req, res) => {
//     const { email } = req.body;
//     const user = users.find(u => u.email === email);

//     if (!user) {
//         return res.status(404).send('User not found');
//     }

//     const token = crypto.randomBytes(20).toString('hex');
//     user.resetToken = token;
//     user.resetTokenExpiry = Date.now() + 3600000; // 1 hour

//     const mailOptions = {
//         to: user.email,
//         from: 'your-email@gmail.com',
//         subject: 'Password Reset',
//         text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
//                      Please click on the following link, or paste this into your browser to complete the process:\n\n
//                      http://localhost:3000/reset-password/${token}\n\n
//                      If you did not request this, please ignore this email and your password will remain unchanged.\n`
//     };

//     transporter.sendMail(mailOptions, (err) => {
//         if (err) {
//             return res.status(500).send('Error sending email');
//         }
//         res.status(200).send('Password reset email sent');
//     });
// });

// // Reset Password
// router.post('/reset-password/:token', (req, res) => {
//     const { token } = req.params;
//     const { newPassword } = req.body;
//     const user=users.find(u => u.resetToken === token && u.resetTokenExpiry > Date.now());

//     if (!user) {
//         return res.status(400).send('Password reset token is invalid or has expired');
//     }

//     user.password = newPassword;
//     user.resetToken = null;
//     user.resetTokenExpiry = null;

//     res.status(200).send('Password has been reset');
// });

// module.exports = router;