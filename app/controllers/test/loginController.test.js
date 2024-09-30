const { login } = require('../../controllers/auth/loginController');
const { handleLogin, generateOtp } = require('../../services/authService');
const { sendVerificationEmail } = require('../../helpers/emailHelper');

jest.mock('../../services/authService.js');
jest.mock('../../helpers/emailHelper');

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
    handleLogin.mockResolvedValue({ user: mockUser });
    generateOtp.mockResolvedValue('123456');
    sendVerificationEmail.mockResolvedValue(); // Mocking email sending

    await login(req, res);

    expect(handleLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(generateOtp).toHaveBeenCalledWith('user123');
    expect(sendVerificationEmail).toHaveBeenCalledWith('test@example.com', '123456', 'loginOtp');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'OTP sent to your email. Please verify.' });
  });

  test('should return 401 when credentials are invalid', async () => {
    handleLogin.mockRejectedValue(new Error('Unauthorized'));

    await login(req, res);

    expect(handleLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });



});
