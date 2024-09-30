const User = require('../../model/userModel'); // Adjust path as necessary

const logout = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204); 

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    return res.sendStatus(204); 
};

module.exports = logout; 
