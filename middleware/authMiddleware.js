import { UnauthenticatedError, UnauthorizedError } from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';

// ✅ Authenticates any user with a valid token from cookies
export const authenticateUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new UnauthenticatedError('Authentication invalid'));
  }

  try {
    const { userId, role } = verifyJWT(token);
    req.user = { userId, role }; // Attach user info to the request
    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return next(new UnauthenticatedError('Authentication invalid'));
  }
};

// ✅ Authorizes access based on allowed user roles
export const authorizePermissions = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new UnauthorizedError('Unauthorized to access this route');
    }

    next();
  };
};
