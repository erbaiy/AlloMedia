const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }],
  refreshToken: {
    type: String,
  },
  otp: { type: String }, // Add OTP field
  otpExpiration: { type: Date } // Add expiration time for the OTP
});


module.exports = mongoose.model('User', userSchema);