
import { Record } from '../models/record.js';
import { AppError } from '../utils/appError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';


const buildFilter = (userId, { type, category, startDate, endDate, search }) => {
  const filter = { createdBy: userId };

  if (type) filter.type = type;
  if (category) filter.category = { $regex: category, $options: 'i' };

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  if (search) {
    filter.$text = { $search: search };
  }

  return filter;
};


export const createRecordService = async (userId, data) => {
  const record = await Record.create({ ...data, createdBy: userId });
  return record;
};


export const getRecordsService = async (userId, queryParams) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'date',
    order = 'desc',
    ...filterParams
  } = queryParams;

  const filter = buildFilter(userId, filterParams);
  const sortOrder = order === 'asc' ? 1 : -1;
  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    Record.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
    Record.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    records,
    pagination: {
      total,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};


export const updateRecordService = async (userId, recordId, updateData) => {
  const record = await Record.findOneAndUpdate(
    { _id: recordId, createdBy: userId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!record) {
    throw new AppError('Record not found or access denied.', 404, ERROR_CODES.NOT_FOUND);
  }

  return record;
};


export const deleteRecordService = async (userId, recordId) => {
  const record = await Record.findOne({ _id: recordId, createdBy: userId });

  if (!record) {
    throw new AppError('Record not found or access denied.', 404, ERROR_CODES.NOT_FOUND);
  }

  await record.softDelete();
  return { message: 'Record deleted successfully.' };
};
