import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import { comparePassword, hashPassword } from '../../utils/passwordUtils.js';
import { UnauthenticatedError } from '../../errors/customErrors.js';
import { createJWT } from '../../utils/tokenUtils.js';

export const register = async (req, res) => {
  // Assign roles based on how many users exist
  const userCount = await User.countDocuments();

  if (userCount === 0) {
    req.body.role = 'superadmin';
  } else if (userCount === 1) {
    req.body.role = 'admin';
  } else {
    req.body.role = 'user';
  }

  // Hash the password before saving
  const hashedPwd = await hashPassword(req.body.password);
  req.body.password = hashedPwd;

  // Create new user
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: 'User created' });
};

export const login = async (req, res, next) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });

    // Verify password and user existence
    const isValidUser = user && (await comparePassword(req.body.password, user.password));
    if (!isValidUser) {
      throw new UnauthenticatedError('Invalid credentials');
    }

    // Create JWT token
    const token = createJWT({ userId: user._id, role: user.role });

    // Set cookie expiry to 1 day
    const OneDay = 1000 * 60 * 60 * 24;

    // Send token as secure, HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + OneDay),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    });

    // Send success response with user data AND token (so frontend can store it)
    res.status(StatusCodes.OK).json({
      msg: 'Login successful',
      token,   // <---- added token here
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  // Overwrite the cookie to expire immediately
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: 'User logged out!' });
};
