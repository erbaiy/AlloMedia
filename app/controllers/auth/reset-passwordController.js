const jwt = require('jsonwebtoken');
const User = require('../../model/userModel');
const bcrypt = require('bcrypt');

const rsetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body; // Le nouveau mot de passe depuis le corps de la requête
        const { token } = req.params; // Token depuis les paramètres de l'URL

        // Vérifier et décoder le token JWT
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!tokenDecoded) {
            return res.status(400).send('Invalid or expired token');
        }    

        // Trouver l'utilisateur par email
        const user = await User.findOne({ email: tokenDecoded.email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // update user password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Envoyer une réponse de succès
        return res.status(200).send('Password updated successfully');
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).send('Token has expired');
        }
        return res.status(400).json({ message: 'Error resetting password', error: error.message });
    }
};

module.exports = rsetPassword;
