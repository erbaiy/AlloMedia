
// Import necessary libraries
const { registerUser, generateVerificationToken } = require('../../services/authService');
const { sendVerificationEmail } = require('../../helpers/emailHelper');
const register = require('../auth/registerController'); // Update the path as necessary

// Mock the dependencies
jest.mock('../../helpers/emailHelper');
jest.mock('../../services/authService.js');

describe('User Registration Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: 'testuser',
        password: 'testpassword',
        email: 'testuser@example.com',
        roles: ['user'], // Changed from ['/services/authService.js'] to ['user']
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should register a new user, generate token, and send verification email', async () => {
    // Mock the service and helper functions
    const mockUser = { _id: 'user123', email: 'testuser@example.com' };
    registerUser.mockResolvedValue(mockUser);
    generateVerificationToken.mockReturnValue('verificationToken123');
    sendVerificationEmail.mockResolvedValue();

    // Call the controller
    await register(req, res);

    // Assertions
    expect(registerUser).toHaveBeenCalledWith('testuser', 'testpassword', 'testuser@example.com', ['user']);
    expect(generateVerificationToken).toHaveBeenCalledWith(mockUser._id);
    expect(sendVerificationEmail).toHaveBeenCalledWith('testuser@example.com', 'verificationToken123');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully. Please verify your email.' });
  });

  it('should handle errors and return a 400 status', async () => {
    // Mock the service to throw an error
    const errorMessage = 'Error registering user';
    registerUser.mockRejectedValue(new Error(errorMessage));

    // Call the controller
    await register(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error registering user', error: errorMessage });
  });
});