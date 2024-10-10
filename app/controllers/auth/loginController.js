
const { handleLogin, generateOtp, validateOtp } = require('../../services/authService');
// const { sendOtpEmail } = require('../../services/emailService');
const { sendVerificationEmail } = require('../../helpers/emailHelper');
const User = require('../../model/userModel');
const jwt = require('jsonwebtoken');






const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const {user} = await handleLogin(email, password);

        const generatedOtp = await generateOtp(user._id);

        await sendVerificationEmail(user.email, generatedOtp, 'loginOtp');

        return res.status(200).json({
            
            message: 'OTP sent to your email. Please verify.',
        });

    } catch (error) {
        // Improved error logging and handling
        if (error.message === 'Unauthorized') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        console.error("Login error:", error); // Add detailed error logging
        return res.status(400).json({ message: 'Error logging in', error: error.message });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    // Check for missing fields
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    try {
        // Validate OTP
        const isOtpValid = await validateOtp(email, otp);

        if (!isOtpValid) {
            return res.status(401).json({ message: 'Invalid or expired OTP.' });
        }

        // Fetch the user from the database
        const user = await User.findOne({ email });
        if (!user) {
            console.error('User not found for email:', email); // More detailed logging
            return res.status(404).json({ message: 'User not found.' });
        }

        // Generate new access token
        const accessToken = jwt.sign(
            { username: user.username, userId: user._id, roles: user.roles },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '60s' }
        );


           // Generate new refresh token
           const refreshToken = jwt.sign(
            { username: user.username, userId: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        // // Generate new refresh token
        // const refreshToken = jwt.sign(
        //     { userId: user._id },
        //     process.env.REFRESH_TOKEN_SECRET,
        //     { expiresIn: '7d' }
        // );

        // Save the refresh token in a secure, HTTP-only cookie
        // res.cookie('jwt', refreshToken, {
        //     httpOnly: true,
        //     secure: false, // Must be false for HTTP
        //     sameSite: 'lax', // Allows cookies to be sent with top-level navigations
        //     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        // });


        res.cookie('jwt', refreshToken, {
            httpOnly: true, // Empêche l'accès côté client via JavaScript
            secure: false, // Doit être 'true' en production (HTTPS)
            sameSite: 'lax', // 'lax' pour le développement, 'none' pour la production avec HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en millisecondes
            path: '/', // Assure que le cookie est accessible sur toutes les routes
        });
        

        // Send access token and user info in the response
        return res.status(200).json({
            message: 'Login successful',
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles
            }
        });

    } catch (error) {
        console.error("Error occurred during OTP verification:", error); // Improved logging
        return res.status(400).json({ message: 'Error verifying OTP', error: error.message });
    }
};

module.exports = { login, verifyOtp };
