
import { loginUser, registerUser, refreshAccessToken, logoutUser } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { setRefreshTokenCookie, clearRefreshTokenCookie } from '../utils/jwt.js';


export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);

  sendSuccess(res, 201, 'Account created successfully.', { user });
});


export const login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await loginUser(req.body);

  setRefreshTokenCookie(res, refreshToken);

  sendSuccess(res, 200, 'Logged in successfully.', { accessToken, user });
});


export const refreshToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;

  const { accessToken, refreshToken: newRefreshToken } =
    await refreshAccessToken(incomingToken);

  // Rotation 
  setRefreshTokenCookie(res, newRefreshToken);

  sendSuccess(res, 200, 'Token refreshed successfully.', { accessToken });
});


export const logout = asyncHandler(async (req, res) => {
  await logoutUser(req.user.userId);
  clearRefreshTokenCookie(res);

  sendSuccess(res, 200, 'Logged out successfully.');
});
