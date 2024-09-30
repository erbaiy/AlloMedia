const { verifyOtp } = require('../../controllers/auth/loginController');
const { validateOtp } = require('../../services/authService');
const User = require('../../model/userModel');
const jwt = require('jsonwebtoken');

jest.mock('../../services/authService');
jest.mock('../../model/userModel');
jest.mock('jsonwebtoken');

describe('verifyOtp function', () => {
    let req, res, mockUser;

    beforeEach(() => {
        // Mock console.error to suppress the output in tests
        jest.spyOn(console, 'error').mockImplementation(() => {});

        req = {
            body: {
                email: 'test@example.com',
                otp: '123456',
            },
        };

        res = {
            cookie: jest.fn(), // Mock the cookie function
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockUser = {
            _id: 'user123',
            email: 'test@example.com',
            roles: ['user'], // Assuming roles is part of the user model
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return 400 when email or OTP is missing', async () => {
        req.body.email = ''; // Empty email
        await verifyOtp(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Email and OTP are required.' });
    });

    test('should return 401 when OTP is invalid or expired', async () => {
        validateOtp.mockResolvedValue(false);

        await verifyOtp(req, res);

        expect(validateOtp).toHaveBeenCalledWith('test@example.com', '123456');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired OTP.' });
    });

    test('should return 404 when user is not found', async () => {
        validateOtp.mockResolvedValue(true);
        User.findOne.mockResolvedValue(null);

        await verifyOtp(req, res);

        expect(validateOtp).toHaveBeenCalledWith('test@example.com', '123456');
        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found.' });
    });

    test('should return 200 and verify OTP when OTP is valid', async () => {
        validateOtp.mockResolvedValue(true);
        User.findOne.mockResolvedValue(mockUser);
        jwt.sign
            .mockReturnValueOnce('mockAccessToken')
            .mockReturnValueOnce('mockRefreshToken');

        await verifyOtp(req, res);

        expect(validateOtp).toHaveBeenCalledWith('test@example.com', '123456');
        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(jwt.sign).toHaveBeenCalledTimes(2); // One for accessToken, one for refreshToken
        expect(res.cookie).toHaveBeenCalledWith('jwt', 'mockRefreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Login successful',
            accessToken: 'mockAccessToken',
            user: {
                id: 'user123',
                email: 'test@example.com',
                roles: ['user'],
            },
        });
    });

    test('should return 400 for general errors during OTP verification', async () => {
        const errorMessage = 'Unexpected error';
        validateOtp.mockRejectedValue(new Error(errorMessage));

        await verifyOtp(req, res);

        expect(validateOtp).toHaveBeenCalledWith('test@example.com', '123456');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error verifying OTP',
            error: errorMessage
        });
    });
});
