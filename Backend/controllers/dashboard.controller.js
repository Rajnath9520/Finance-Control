
import { getDashboardSummary } from '../services/dashboard.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';


export const getSummary = asyncHandler(async (req, res) => {
  const summary = await getDashboardSummary(req.user.userId);

  sendSuccess(res, 200, 'Dashboard summary retrieved successfully.', { data: summary });
});

