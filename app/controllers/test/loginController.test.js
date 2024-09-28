const { login } = require('../auth/loginController');
const { handleLogin, generateOtp, validateOtp } = require('../../services/authService');
const { sendOtpEmail } = require('../../services/emailService');
const User = require('../../app/model/userModel');
const bcrypt = require('bcrypt');


// Mock the required modules
jest.mock('bcrypt', () => ({
  compare: jest.fn((inputPassword, hashedPassword) => 
    Promise.resolve(inputPassword === 'correctpassword'))
}));
jest.mock('../../services/authService');
jest.mock('../../services/emailService');
jest.mock('../../model/userModel');

describe('login function', () => {
  let req, res, mockUser;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };
    mockUser = {
      _id: 'user123',
      email: 'test@example.com'
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 200 and send OTP when login is successful', async () => {
    // Mock successful login
    handleLogin.mockResolvedValue({
      user: mockUser,
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken'
    });
    generateOtp.mockResolvedValue('123456');
    sendOtpEmail.mockResolvedValue();

    await login(req, res);

    expect(handleLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(generateOtp).toHaveBeenCalledWith('user123');
    expect(sendOtpEmail).toHaveBeenCalledWith('test@example.com', '123456');
    expect(res.cookie).toHaveBeenCalledWith('jwt', 'mockRefreshToken', expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'OTP sent to your email. Please verify.',
      accessToken: 'mockAccessToken'
    });
  });

  test('should return 401 when credentials are invalid', async () => {
    handleLogin.mockRejectedValue(new Error('Unauthorized'));

    await login(req, res);

    expect(handleLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('should return 401 when password does not match', async () => {
    req.body.password = 'wrongpassword';
    handleLogin.mockRejectedValue(new Error('Unauthorized'));

    await login(req, res);

    expect(handleLogin).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });



});