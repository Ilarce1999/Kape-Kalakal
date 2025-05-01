// middleware/validationMiddleware.js
import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import OrderModel from '../models/OrderModel.js';
import User from '../models/UserModel.js';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError
} from '../errors/customErrors.js';

// Reusable error handler for validation errors
const withValidationErrors = (validateValues) => {
  return [
    ...validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        
        // Custom error handling based on the type of message
        if (errorMessages[0].toLowerCase().includes('no order')) {
          throw new NotFoundError(errorMessages.join(', '));
        }
        if (errorMessages[0].toLowerCase().includes('not authorized')) {
          throw new UnauthorizedError('Not authorized to access this route');
        }
        throw new BadRequestError(errorMessages.join(', '));
      }
      next();
    }
  ];
};

// Validation for creating and editing an order
export const validateOrder = withValidationErrors([
  body('drinkName')
    .notEmpty()
    .withMessage('Drink name is required'),

  body('size')
    .notEmpty()
    .withMessage('Size is required')
    .isIn(['Small', 'Medium', 'Large'])
    .withMessage('Size must be one of Small, Medium, Large'),

  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')

  // Removed totalPrice validation
]);

// Validation for ID parameter (GET, PATCH, DELETE)
export const validateIdParam = withValidationErrors([
  param('id')
    .custom(async (value, { req }) => {
      const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
      if (!isValidMongoId) {
        throw new BadRequestError('Invalid MongoDB id');
      }

      const order = await OrderModel.findById(value);
      if (!order) {
        throw new NotFoundError(`No order with id ${value}`);
      }

      const isAdminOrSuperAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';
      const isOwner = req.user.userId === order.orderedBy.toString();

      if (!isAdminOrSuperAdmin && !isOwner) {
        throw new UnauthorizedError('Not authorized to access this route');
      }
    })
]);

// Validation for user registration
export const validateRegisterInput = withValidationErrors([
  body('name').notEmpty().withMessage('Name is required'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError('Email already exists.');
      }
    }),

  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),

  body('location').notEmpty().withMessage('Location is required')
]);

// Validation for user login
export const validateLoginInput = withValidationErrors([
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),

  body('password').notEmpty().withMessage('Password is required')
]);

// Validation for updating user
export const validateUpdateUserInput = withValidationErrors([
  body('name').notEmpty().withMessage('Name is required'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (email, { req }) => {
      const currentUser = await User.findById(req.user.userId);
      if (!currentUser) {
        throw new BadRequestError('User not found');
      }

      if (email !== currentUser.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new BadRequestError('Email already exists.');
        }
      }
    }),

  body('location').notEmpty().withMessage('Location is required')
]);
