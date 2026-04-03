
import Joi from 'joi'

export const createRecordSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required().messages({
    'number.positive': 'Amount must be a positive number',
    'any.required': 'Amount is required',
  }),
  type: Joi.string().valid('income', 'expense').required().messages({
    'any.only': 'Type must be either "income" or "expense"',
    'any.required': 'Type is required',
  }),
  category: Joi.string().trim().max(50).required().messages({
    'string.max': 'Category cannot exceed 50 characters',
    'any.required': 'Category is required',
  }),
  date: Joi.date().iso().default(() => new Date()),
  note: Joi.string().trim().max(500).allow('').default(''),
});

export const updateRecordSchema = Joi.object({
  amount: Joi.number().positive().precision(2),
  type: Joi.string().valid('income', 'expense'),
  category: Joi.string().trim().max(50),
  date: Joi.date().iso(),
  note: Joi.string().trim().max(500).allow(''),
}).min(1); // At least one field required for update

export const queryRecordSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  type: Joi.string().valid('income', 'expense'),
  category: Joi.string().trim().max(50),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')),
  search: Joi.string().trim().max(100),
  sortBy: Joi.string().valid('date', 'amount').default('date'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
});
