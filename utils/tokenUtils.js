// utils/tokenUtils.js
import jwt from 'jsonwebtoken';

/**
 * Create a JWT token with a given payload.
 * @param {Object} payload - The data to encode in the token (e.g., userId, role).
 * @returns {string} - Signed JWT token.
 */
export const createJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d', // Token expiration time (default 1 day)
  });
};

/**
 * Verify and decode a JWT token.
 * @param {string} token - The JWT token to verify.
 * @returns {Object} - Decoded payload if valid.
 * @throws {Error} - Throws if token is invalid or expired.
 */
export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw error; // Error handling is delegated to the middleware that calls this
  }
};
