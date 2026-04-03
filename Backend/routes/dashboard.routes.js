
import express from 'express'
const router = express.Router();

import { getSummary } from '../controllers/dashboard.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';


router.get(
  '/summary',
  authMiddleware,
  authorizeRoles('admin', 'analyst', 'viewer'),
  getSummary
);

export default router;