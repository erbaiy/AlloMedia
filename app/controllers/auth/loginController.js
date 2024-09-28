
const { handleLogin, generateOtp, validateOtp } = require('../../services/authService');
const { sendOtpEmail } = require('../../services/emailService');
const User = require('../../model/userModel');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Validate email and password and get tokens
        const { user, accessToken, refreshToken } = await handleLogin(email, password);


        // Generate OTP and send it to the user's email
        const generatedOtp = await generateOtp(user._id);
        await sendOtpEmail(user.email, generatedOtp);

        // Set the refresh token in a secure, HTTP-only cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000 // 7 days
        });

        // Notify user to check their email for the OTP
        return res.status(200).json({
            message: 'OTP sent to your email. Please verify.',
            accessToken // Include access token here if needed
        });

    } catch (error) {
        if (error.message === 'Unauthorized') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.status(400).json({ message: 'Error logging in', error: error.message });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    console.log("Email:", email, "OTP:", otp);

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    try {
        console.log("Verifying OTP...");
        // Validate OTP
        const isOtpValid = await validateOtp(email, otp);
        console.log("isOtpValid:", isOtpValid);

        if (!isOtpValid) {
            return res.status(401).json({ message: 'Invalid or expired OTP.' });
        }

        // Fetch the user from the database
        const user = await User.findOne({ email });
        if (!user) {
            console.error('User not found for email:', email);
            return res.status(404).json({ message: 'User not found.' });
        }

        // Generate new access token
        const accessToken = jwt.sign(
            { username: user.username, userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

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
        console.error("Error occurred:", error);
        res.status(400).json({ message: 'Error verifying OTP', error: error.message });
    }
};




module.exports = { login, verifyOtp };

// // authController.js
// const { handleLogin } = require('../../services/authService');

// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Call the service layer function to handle login
//         const { accessToken, refreshToken, user } = await handleLogin(email, password);
       

//         // Set the refresh token in a secure, HTTP-only cookie
//         res.cookie('jwt', refreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production', // Use environment variable to set secure flag
//             sameSite: 'None', // Adjust as necessary
//             maxAge: 24 * 60 * 60 * 1000 // 1 day
//         });

//         // Send access token and user info in the response
//         res.status(200).json({
//             accessToken,
//             user: {
//                 id: user._id,
//                 username: user.username,
//                 email: user.email,
//                 roles: user.roles
//             }
//         });
//     } catch (error) {
//         // Handling specific error messages
//         if (error.message === 'Unauthorized') {
//             return res.sendStatus(401); // Unauthorized status
//         }
//         res.status(400).json({ message: 'Error logging in', error: error.message });
//     }
// };

// module.exports = { login };
