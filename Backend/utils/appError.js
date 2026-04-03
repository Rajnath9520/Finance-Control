
import { ERROR_CODES } from '../constants/errorCodes.js';

export class AppError extends Error {
  constructor(message, statusCode, errorCode = ERROR_CODES.INTERNAL_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

