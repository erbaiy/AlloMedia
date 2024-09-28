const User = require('../../model/userModel'); // Adjust path as necessary

const logout = async (req, res) => {
    try {
        // Check if the JWT token exists in the cookie
        const cookies = req.cookies;

        // If no JWT cookie is present, user is already logged out or not logged in
        if (!cookies?.jwt) {
            return res.status(204).json({ message: 'No content, user already logged out' });
        }

        // Extract the refresh token from the cookie
        const refreshToken = cookies.jwt;

        // Find the user associated with the refresh token
        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({ message: 'Invalid token' }); // Forbidden
        }

        // Remove the refresh token from the user's record
        user.refreshToken = null; // or use another mechanism to invalidate it
        await user.save();

        // Clear the JWT refresh token cookie
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
        });

        // Successfully logged out
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        return res.status(500).json({ message: 'Logout failed', error: error.message });
    }
};

module.exports = logout; // Export the logout function
