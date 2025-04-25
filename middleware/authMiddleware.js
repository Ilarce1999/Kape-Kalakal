import { UnauthenticatedError, UnauthorizedError } from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

// ✅ Authenticates any user with a valid token
export const authenticateUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new UnauthenticatedError('Authentication invalid'));
  }

  try {
    const { userId, role } = verifyJWT(token);

    // ✅ Attach user info to request
    req.user = { userId, role };
    next();
  } catch (error) {
    return next(new UnauthenticatedError('Authentication invalid'));
  }
};

// ✅ Authorizes specific roles (e.g. admin, superadmin)
export const authorizePermissions = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new UnauthorizedError('Unauthorized to access this route');
    }

    next();
  };
};
