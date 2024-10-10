const nodemailer = require('nodemailer');

// Function to create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Function to send verification email
const sendVerificationEmail = async (email, tokenOrOtp, type) => {
  const transporter = createTransporter();
  
  let subject;
  let text;

  switch (type) {
    case "forgetPassword":
      subject = 'Password Reset';
      text = `Hello, Please reset your password by clicking this link: ${process.env.FRONTEND_URL}/auth/reset-password/${tokenOrOtp}`;
      break;
      
    case "loginOtp":
      subject = 'Login OTP';
      text = 'Your OTP is: ' + tokenOrOtp;
      break;

    case "verifyEmail":
      subject = 'Email Verification';
      text = `Please verify your email by clicking this link: ${process.env.FRONTEND_URL}/register/verify-email/${tokenOrOtp}`;
      break;

    default:
      throw new Error('Invalid email type');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = {
  sendVerificationEmail,
};
