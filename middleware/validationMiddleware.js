import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import OrderModel from '../models/OrderModel.js';
import User from '../models/UserModel.js';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/customErrors.js';

// Common error handler
const withValidationErrors = (validateValues) => {
  return [
    ...validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err) => err.msg);

        const firstError = errorMessages[0].toLowerCase();

        if (firstError.includes('no order')) {
          throw new NotFoundError(errorMessages.join(', '));
        }
        if (firstError.includes('not authorized')) {
          throw new UnauthorizedError('Not authorized to access this route');
        }
        throw new BadRequestError(errorMessages.join(', '));
      }
      next();
    },
  ];
};

// Validation for order creation/editing
export const validateOrder = withValidationErrors([
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid userId');
      }
      return true;
    }),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),

  body('items')
    .isArray({ min: 1 })
    .withMessage('Items must be a non-empty array'),

  body('items.*.productId')
    .notEmpty()
    .withMessage('Each item must have a productId')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid productId');
      }
      return true;
    }),

  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Each item must have a quantity of at least 1'),

  body('items.*.totalPrice')
    .isNumeric()
    .withMessage('Each item must have a totalPrice'),

  body('subtotal')
    .isNumeric()
    .withMessage('Subtotal must be a number'),

  body('deliveryFee')
    .isNumeric()
    .withMessage('Delivery fee must be a number'),

  body('total')
    .isNumeric()
    .withMessage('Total must be a number'),

  body('status')
    .optional()
    .isString()
    .withMessage('Status must be a string'),
]);

// Validation for order ID access (GET, PATCH, DELETE)
export const validateIdParam = withValidationErrors([
  param('id').custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) {
      throw new BadRequestError('Invalid MongoDB id');
    }

    const order = await OrderModel.findById(value);
    if (!order) {
      throw new NotFoundError(`No order with id ${value}`);
    }

    const isOwner = req.user.userId === order.userId.toString();
    const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      throw new UnauthorizedError('Not authorized to access this route');
    }
  }),
]);

// Validation for registration
export const validateRegisterInput = withValidationErrors([
  body('name')
    .notEmpty()
    .withMessage('Name is required'),

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

  body('location')
    .notEmpty()
    .withMessage('Location is required'),
]);

// Validation for login
export const validateLoginInput = withValidationErrors([
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
]);

// Validation for updating user
export const validateUpdateUserInput = withValidationErrors([
  body('name')
    .notEmpty()
    .withMessage('Name is required'),

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

  body('location')
    .notEmpty()
    .withMessage('Location is required'),
]);
