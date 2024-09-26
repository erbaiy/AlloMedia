// authController.js
const { handleLogin } = require('../../services/authService');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Call the service layer function to handle login
        const { accessToken, refreshToken, user } = await handleLogin(email, password);

        // Set the refresh token in a secure, HTTP-only cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use environment variable to set secure flag
            sameSite: 'None', // Adjust as necessary
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // Send access token and user info in the response
        res.status(200).json({
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles
            }
        });
    } catch (error) {
        // Handling specific error messages
        if (error.message === 'Unauthorized') {
            return res.sendStatus(401); // Unauthorized status
        }
        res.status(400).json({ message: 'Error logging in', error: error.message });
    }
};

module.exports = { login };
