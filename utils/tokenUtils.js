// utils/tokenUtils.js
import jwt from 'jsonwebtoken';

export const createJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d', // e.g., '1d', '2h'
  });
};

export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw error; // Let middleware handle the error
  }
};
