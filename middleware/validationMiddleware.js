// validationMiddleware.js

import { body, param, validationResult } from 'express-validator';
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';
import { SIZE } from '../utils/constants.js';
import mongoose from 'mongoose';
import OrderModel from '../models/OrderModel.js';

// Middleware to handle validation errors
const withValidationErrors = (validateValues) => {
  return [
    ...validateValues,
    async (req, res, next) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const errorMessages = errors.array().map((error) => error.msg);
          // Check if any error message indicates a NotFoundError
          const notFoundError = errorMessages.find((msg) =>
            msg.toLowerCase().includes('no drink')
          );
          if (notFoundError) {
            return next(new NotFoundError(notFoundError));
          }
          return next(new BadRequestError(errorMessages.join(', ')));
        }
        next();
      } catch (err) {
        next(err);
      }
    },
  ];
};

// Validation for creating or updating a drink order
export const validateDrinkOrder = withValidationErrors([
  body('drinkName').notEmpty().withMessage('Select a drink'),
  body('size')
    .isIn(Object.values(SIZE))
    .withMessage('Select a valid size'),
]);

// Validation for MongoDB ObjectId parameter
export const validateIdParam = withValidationErrors([
  param('id').custom(async (value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new BadRequestError('Invalid MongoDB id');
    }

    const drink = await OrderModel.findById(value);
    if (!drink) {
      throw new NotFoundError(`No drink with id ${value}`);
    }
    return true;
  }),
]);

export const validateRegisterInput = withValidationErrors([
  
])
