
import { User } from '../models/user.js';
import { AppError } from '../utils/appError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { ROLES } from '../constants/roles.js';


export const getAllUsersService = async () => {
  const users = await User.find({}).select('-password -refreshTokenHash').sort({ createdAt: -1 });
  return users;
};


export const updateUserService = async (userId, { role, isActive }) => {
  const allowedRoles = Object.values(ROLES);

  if (role && !allowedRoles.includes(role)) {
    throw new AppError(`Invalid role. Must be one of: ${allowedRoles.join(', ')}`, 400, ERROR_CODES.VALIDATION_ERROR);
  }

  const patch = {};
  if (role      !== undefined) patch.role     = role;
  if (isActive  !== undefined) patch.isActive = isActive;

  if (Object.keys(patch).length === 0) {
    throw new AppError('No valid fields to update.', 400, ERROR_CODES.VALIDATION_ERROR);
  }

  const user = await User.findByIdAndUpdate(userId, patch, { new: true }).select('-password -refreshTokenHash');

  if (!user) {
    throw new AppError('User not found.', 404, ERROR_CODES.NOT_FOUND);
  }

  return user;
};

