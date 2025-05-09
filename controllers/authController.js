import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import { comparePassword, hashPassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { createJWT } from '../utils/tokenUtils.js';

export const register = async (req, res) => {
  const userCount = await User.countDocuments();

  if (userCount === 0) {
    req.body.role = 'superadmin';
  } else if (userCount === 1) {
    req.body.role = 'admin';
  } else {
    req.body.role = 'user';
  }

  const hashedPwd = await hashPassword(req.body.password);
  req.body.password = hashedPwd;

  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: 'user created' });
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    const isValidUser = user && (await comparePassword(req.body.password, user.password));
    if (!isValidUser) {
      throw new UnauthenticatedError('invalid credentials');
    }

    const token = createJWT({ userId: user._id, role: user.role });

    const OneDay = 1000 * 60 * 60 * 24;
    res.cookie('token', token, {
    httpOnly: true, 
    expires: new Date(Date.now() + OneDay), 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'Lax', 
 });

    res.status(200).json({
    msg: 'Login successful',
    user: {
    id: user._id,
    name: user.name,
    role: user.role,
    email: user.email
   },
  });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};
