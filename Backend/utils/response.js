
export const sendSuccess = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

export const sendError = (res, statusCode, message, errorCode, details = null) => {
  const payload = {
    success: false,
    message,
    errorCode,
  };
  if (details) payload.details = details;
  return res.status(statusCode).json(payload);
};

