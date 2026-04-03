
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { ROLES } from '../constants/roles.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must be at most 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, 
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.VIEWER,
    },

    refreshTokenHash: {
      type: String,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.setRefreshTokenHash = async function (token) {
  this.refreshTokenHash = await bcrypt.hash(token, 10);
  await this.save({ validateBeforeSave: false });
};

userSchema.methods.verifyRefreshTokenHash = async function (token) {
  if (!this.refreshTokenHash) return false;
  return bcrypt.compare(token, this.refreshTokenHash);
};

userSchema.methods.clearRefreshToken = async function () {
  this.refreshTokenHash = null;
  await this.save({ validateBeforeSave: false });
};

export const User = mongoose.model('User', userSchema);
