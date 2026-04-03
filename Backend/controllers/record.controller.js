
import { createRecordService, getRecordsService, updateRecordService, deleteRecordService } from '../services/record.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';


export const createRecord = asyncHandler(async (req, res) => {
  const record = await createRecordService(req.user.userId, req.body);

  sendSuccess(res, 201, 'Record created successfully.', { record });
});


export const getRecords = asyncHandler(async (req, res) => {
  const result = await getRecordsService(req.user.userId, req.query);

  sendSuccess(res, 200, 'Records retrieved successfully.', result);
});


export const updateRecord = asyncHandler(async (req, res) => {
  const record = await updateRecordService(
    req.user.userId,
    req.params.id,
    req.body
  );

  sendSuccess(res, 200, 'Record updated successfully.', { record });
});


export const deleteRecord = asyncHandler(async (req, res) => {
  const result = await deleteRecordService(req.user.userId, req.params.id);

  sendSuccess(res, 200, result.message);
});
