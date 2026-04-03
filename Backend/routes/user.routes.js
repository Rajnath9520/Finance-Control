
import express from 'express'
const router = express.Router();


import { getAllUsers, updateUser } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';


router.use(authMiddleware);
router.use(authorizeRoles('admin'));

router.get('/',     getAllUsers);
router.patch('/:id', updateUser);

export default router;