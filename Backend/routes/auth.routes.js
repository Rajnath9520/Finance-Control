
import express from 'express'
const router = express.Router();


import { register,login, refreshToken,logout } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validation/auth.validation.js';

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', refreshToken);

// Protected route
router.post('/logout', authMiddleware, logout);

export default router;