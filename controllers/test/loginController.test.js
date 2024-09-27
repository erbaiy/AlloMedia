const { handleLogin } = require('../../services/authService');
const { login } = require('../auth/loginController'); // Ensure this path is correct

// Mock the dependencies 
jest.mock('../../services/authService.js');

describe('User login Controller', () => {
  let res, req;

  beforeEach(() => {
    req = {
      body: {
        email: 'testuser@example.com',
        password: 'testpassword',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(), // Mock the cookie function
      sendStatus: jest.fn(), // Mock sendStatus
    };
  });

  it('should call handleLogin with the correct email and password', async () => {
    // Mock the service layer response
    const mockAccessToken = 'mockAccessToken';
    const mockRefreshToken = 'mockRefreshToken';
    const mockUser = {
      _id: 'user123',
      username: 'testuser',
      email: 'testuser@example.com',
      roles: ['user'],
    };

    // Mock handleLogin to return the expected response
    handleLogin.mockResolvedValue({
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
      user: mockUser,
    });

    // Call the login controller
    await login(req, res);

    // Ensure handleLogin is called with correct arguments
    expect(handleLogin).toHaveBeenCalledWith(req.body.email, req.body.password);
  });

  it('should set the refresh token in the cookie with correct options', async () => {
    const mockAccessToken = 'mockAccessToken';
    const mockRefreshToken = 'mockRefreshToken';
    const mockUser = {
      _id: 'user123',
      username: 'testuser',
      email: 'testuser@example.com',
      roles: ['user'],
    };

    handleLogin.mockResolvedValue({
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
      user: mockUser,
    });

    await login(req, res);

    // Assert the cookie is set with correct options
    expect(res.cookie).toHaveBeenCalledWith('jwt', mockRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Depending on the environment
      sameSite: 'None', 
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
  });

  it('should return a status of 200 on successful login', async () => {
    const mockAccessToken = 'mockAccessToken';
    const mockRefreshToken = 'mockRefreshToken';
    const mockUser = {
      _id: 'user123',
      username: 'testuser',
      email: 'testuser@example.com',
      roles: ['user'],
    };

    handleLogin.mockResolvedValue({
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
      user: mockUser,
    });

    await login(req, res);

    // Assert the status is 200
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should return access token and user info in response', async () => {
    const mockAccessToken = 'mockAccessToken';
    const mockRefreshToken = 'mockRefreshToken';
    const mockUser = {
      _id: 'user123',
      username: 'testuser',
      email: 'testuser@example.com',
      roles: ['user'],
    };

    handleLogin.mockResolvedValue({
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
      user: mockUser,
    });

    await login(req, res);

    // Assert the json response includes access token and user info
    expect(res.json).toHaveBeenCalledWith({
      accessToken: mockAccessToken,
      user: {
        id: mockUser._id,
        username: mockUser.username,
        email: mockUser.email,
        roles: mockUser.roles,
      },
    });
  });

  it('should return 401 when login fails due to incorrect credentials', async () => {
    // Mock handleLogin to throw an error for unauthorized login attempt
    handleLogin.mockRejectedValue(new Error('Unauthorized'));

    await login(req, res);

    // Assert that the controller returns a 401 status
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });
});
