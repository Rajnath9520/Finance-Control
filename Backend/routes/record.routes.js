
import express from 'express'
const router = express.Router();

import { getRecords, createRecord,updateRecord,deleteRecord } from '../controllers/record.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.js';
import { createRecordSchema, updateRecordSchema, queryRecordSchema } from '../validation/record.validation.js';


router.use(authMiddleware);

router.get(
  '/',
  authorizeRoles('admin', 'analyst'),
  validate(queryRecordSchema, 'query'),
  getRecords
);

router.post(
  '/',
  authorizeRoles('admin'),
  validate(createRecordSchema),
  createRecord
);

router.patch(
  '/:id',
  authorizeRoles('admin'),
  validate(updateRecordSchema),
  updateRecord
);

router.delete(
  '/:id',
  authorizeRoles('admin'),
  deleteRecord
);

export default router;