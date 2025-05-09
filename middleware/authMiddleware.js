// middleware/authMiddleware.js
import { UnauthenticatedError } from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';

// ✅ Authenticates any user with a valid token from cookies or Authorization header
export const authenticateUser = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new UnauthenticatedError('Authentication token missing.'));
  }

  try {
    const payload = verifyJWT(token); // this will throw if expired/invalid
    req.user = {
      userId: payload.userId,
      role: payload.role,
    };
    next();
  } catch (error) {
    console.error('JWT verification failed:', error.name, error.message);

    if (error.name === 'TokenExpiredError') {
      return next(new UnauthenticatedError('Token has expired. Please log in again.'));
    }

    return next(new UnauthenticatedError('Invalid authentication token.'));
  }
};

// ✅ Authorizes access based on allowed user roles
export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: 'Permission denied: insufficient role' });
    }
    next();
  };
};

// ✅ Check if the user is a SuperAdmin
export const isSuperAdmin = (req, res, next) => {
  if (req.user?.role !== 'superadmin') {
    return res.status(403).json({ message: 'Permission denied: SuperAdmin access only' });
  }
  next();
};