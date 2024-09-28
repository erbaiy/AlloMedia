const express = require('express');
const router = express.Router();
const registerController = require('../controllers/auth/registerController');
const verifyEmail = require('../controllers/auth/verificationController');

// Registration route
router.post('/', registerController);

// Email verification route
router.get('/verify-email', verifyEmail);

module.exports = router;
