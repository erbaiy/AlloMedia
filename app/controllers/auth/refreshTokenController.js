// refreshTokenController.js
const User = require('../../model/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    // Check if refresh token exists in cookies
    if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized

    const refreshToken = cookies.jwt;

    try {
     
        // Verify the refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            // Check if the token is invalid or doesn't match the user's username
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403); // Forbidden

            // Create a new access token
            const accessToken = jwt.sign(
                { username: decoded.username, userId: foundUser._id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' } // Adjusted lifespan for access token
            );

            // Send the new access token as a response
            res.json({ accessToken });
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal Server Error
    }
};

module.exports = { handleRefreshToken };
