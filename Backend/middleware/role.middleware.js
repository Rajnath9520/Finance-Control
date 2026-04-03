
import { AppError } from '../utils/appError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';


export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401, ERROR_CODES.UNAUTHORIZED);
  }

  if (!allowedRoles.includes(req.user.role)) {
    throw new AppError(
      `Access denied. Required roles: ${allowedRoles.join(', ')}. Your role: ${req.user.role}`,
      403,
      ERROR_CODES.FORBIDDEN
    );
  }

  next();
};
