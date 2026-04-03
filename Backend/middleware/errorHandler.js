
import { AppError } from '../utils/appError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';


export const handleMongooseErrors = (err) => {

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return new AppError(
      `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`,
      409,
      ERROR_CODES.CONFLICT
    );
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    const error = new AppError(messages.join('. '), 400, ERROR_CODES.VALIDATION_ERROR);
    return error;
  }

  // Invalid ObjectId
  if (err.name === 'CastError') {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400, ERROR_CODES.VALIDATION_ERROR);
  }

  return null;
};


export const errorHandler = (err, req, res, next) => {
  
  const mongooseErr = handleMongooseErrors(err);
  if (mongooseErr) {
    return res.status(mongooseErr.statusCode).json({
      success: false,
      message: mongooseErr.message,
      errorCode: mongooseErr.errorCode,
    });
  }

  // Operational errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
      ...(err.details && { details: err.details }),
    });
  }

  // Unknown errors
  console.error('UNHANDLED ERROR:', err);

  return res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again later.',
    errorCode: ERROR_CODES.INTERNAL_ERROR,
  });
};
