
import { User } from '../models/user.js';
import { AppError } from '../utils/appError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';


export const registerUser = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError('An account with this email already exists.', 409, ERROR_CODES.USER_EXISTS);
  }

  const user = await User.create({ name, email, password, role });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};


export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email, isActive: true }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password.', 401, ERROR_CODES.INVALID_CREDENTIALS);
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401, ERROR_CODES.INVALID_CREDENTIALS);
  }

  const tokenPayload = { userId: user._id.toString(), role: user.role };

  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);


  await user.setRefreshTokenHash(refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};


export const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new AppError('Refresh token is missing.', 401, ERROR_CODES.UNAUTHORIZED);
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(incomingRefreshToken);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Refresh token expired. Please log in again.', 401, ERROR_CODES.TOKEN_EXPIRED);
    }
    throw new AppError('Invalid refresh token.', 401, ERROR_CODES.INVALID_TOKEN);
  }

  const user = await User.findById(decoded.userId).select('+refreshTokenHash');
  if (!user || !user.isActive) {
    throw new AppError('User not found or inactive.', 401, ERROR_CODES.UNAUTHORIZED);
  }

  const isTokenValid = await user.verifyRefreshTokenHash(incomingRefreshToken);
  if (!isTokenValid) {
    // clear stored token 
    await user.clearRefreshToken();
    throw new AppError('Refresh token reuse detected. Please log in again.', 401, ERROR_CODES.INVALID_TOKEN);
  }

  const tokenPayload = { userId: user._id.toString(), role: user.role };

  const newAccessToken = signAccessToken(tokenPayload);
  const newRefreshToken = signRefreshToken(tokenPayload);

  // Token rotation
  await user.setRefreshTokenHash(newRefreshToken);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};


export const logoutUser = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    await user.clearRefreshToken();
  }
};

