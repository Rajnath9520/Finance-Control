
import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/appError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { asyncHandler } from '../utils/asyncHandler.js';


export const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required. Please log in.', 401, ERROR_CODES.UNAUTHORIZED);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Access token expired. Please refresh your token.', 401, ERROR_CODES.TOKEN_EXPIRED);
    }
    throw new AppError('Invalid access token.', 401, ERROR_CODES.INVALID_TOKEN);
  }
});
