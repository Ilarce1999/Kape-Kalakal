import { UnauthenticatedError } from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';

/**
 * Middleware to authenticate user via JWT token.
 * Looks for token in Authorization header or cookie.
 */
export const authenticateUser = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // If no token in header, check cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // If still no token, throw error
    if (!token || typeof token !== 'string') {
      console.warn('Missing or invalid token.');
      return next(new UnauthenticatedError('Authentication token missing.'));
    }

    // Log received token (for debugging)
    console.log('🔐 Token received:', token);

    // Verify token
    const payload = verifyJWT(token);

    // Attach payload info to request object
    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    console.error('❌ JWT verification failed:', error.name, error.message);

    if (error.name === 'TokenExpiredError') {
      return next(new UnauthenticatedError('Token expired. Please log in again.'));
    }

    return next(new UnauthenticatedError('Invalid authentication token.'));
  }
};

/**
 * Middleware to allow only specified roles.
 */
export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: 'Permission denied: insufficient role' });
    }
    next();
  };
};

/**
 * Middleware to restrict access to SuperAdmin users only.
 */
export const isSuperAdmin = (req, res, next) => {
  if (req.user?.role !== 'superadmin') {
    return res.status(403).json({ message: 'Permission denied: SuperAdmin access only' });
  }
  next();
};
