const express = require('express');
const router = express.Router();
const  loginController= require('../controllers/auth/loginController');
const  forgetPassword= require('../controllers/auth/forget-passwordController');
const  rsetPassword= require('../controllers/auth/reset-passwordController');

router.post('/', loginController.login);

router.post('/verify-otp', loginController.verifyOtp);
router.post('/forget-password', forgetPassword);
router.post('/reset-password/:token',rsetPassword);



module.exports = router;