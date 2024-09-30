const register = require('../../controllers/auth/registerController'); // Adjust the path as needed
const { registerUser, generateVerificationToken } = require('../../services/authService');
const { sendVerificationEmail } = require('../../helpers/emailHelper');

// Mock the dependencies
jest.mock('../../services/authService');
jest.mock('../../helpers/emailHelper');

describe('register function', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: 'testuser',
        password: 'testpassword',
        email: 'test@example.com',
        roles: ['user']
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a user successfully', async () => {
    const mockUser = { _id: 'mockUserId', ...req.body };
    const mockToken = 'mockVerificationToken';

    registerUser.mockResolvedValue(mockUser);
    generateVerificationToken.mockReturnValue(mockToken);
    sendVerificationEmail.mockResolvedValue();

    await register(req, res);

    expect(registerUser).toHaveBeenCalledWith(req.body.username, req.body.password, req.body.email, req.body.roles);
    expect(generateVerificationToken).toHaveBeenCalledWith(mockUser._id);
    expect(sendVerificationEmail).toHaveBeenCalledWith(req.body.email, mockToken, 'verifyEmail');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully. Please verify your email.' });
  });

  it('should handle registration error', async () => {
    const errorMessage = 'Registration failed';
    registerUser.mockRejectedValue(new Error(errorMessage));

    await register(req, res);

    expect(registerUser).toHaveBeenCalledWith(req.body.username, req.body.password, req.body.email, req.body.roles);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error registering user', error: errorMessage });
  });

  it('should handle verification email error', async () => {
    const mockUser = { _id: 'mockUserId', ...req.body };
    const mockToken = 'mockVerificationToken';
    const errorMessage = 'Email sending failed';

    registerUser.mockResolvedValue(mockUser);
    generateVerificationToken.mockReturnValue(mockToken);
    sendVerificationEmail.mockRejectedValue(new Error(errorMessage));

    await register(req, res);

    expect(registerUser).toHaveBeenCalledWith(req.body.username, req.body.password, req.body.email, req.body.roles);
    expect(generateVerificationToken).toHaveBeenCalledWith(mockUser._id);
    expect(sendVerificationEmail).toHaveBeenCalledWith(req.body.email, mockToken, 'verifyEmail');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error registering user', error: errorMessage });
  });
});