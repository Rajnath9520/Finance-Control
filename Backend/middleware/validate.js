
import { AppError } from '../utils/appError.js';
import { ERROR_CODES } from '../constants/errorCodes.js';


export const validate = (schema, target = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[target], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message,
    }));
    const err = new AppError('Validation failed', 400, ERROR_CODES.VALIDATION_ERROR);
    err.details = details;
    return next(err);
  }

  req[target] = value;
  next();
};
