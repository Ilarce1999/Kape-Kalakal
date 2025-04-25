import { body, param, validationResult } from 'express-validator';
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from '../errors/customErrors.js';
import { SIZE } from '../utils/constants.js';
import mongoose from 'mongoose';
import OrderModel from '../models/OrderModel.js';
import User from '../models/UserModel.js';

// Middleware to handle validation errors
const withValidationErrors = (validateValues) => {
    return[
      validateValues,
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const errorMessages = errors.array().map((error) => error.msg);
          if (errorMessages[0].startsWith('no order')) {
            throw new NotFoundError(errorMessages);

          }
          if (errorMessages[0].startsWith('not authorized')){
            throw new UnauthorizedError('not authorized to access this route');
          }
              throw new BadRequestError(errorMessages);
        }

        next();
      }
    ]
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
  param('id').custom(async (value, { req }) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');
    const order = await OrderModel.findById(value);
    if(!order) throw new NotFoundError(`no order with id ${value}`);

    //console.log(order);
    const isAdmin = req.user.role === 'admin'
    const isOwner = req.user.userId === order.orderedBy.toString()
    if(!isAdmin && !isOwner) throw new UnauthorizedError('not authorized to access this route')

  }),
]);

export const validateRegisterInput = withValidationErrors([
  body('name').notEmpty().withMessage('name is required'),
  body('email').notEmpty().withMessage('email is required')
  .isEmail()
  .withMessage('invalid email format')
  .custom(async(email) => {
     const user = await User.findOne({email})
     if (user){
      throw new BadRequestError('Email already exists.');
     }
  }),
  body('password').notEmpty().withMessage('password is required').isLength({min:8}).withMessage(' Password must be at least 8 characters long'),
  body('location').notEmpty().withMessage('location is required'),
]);

export const validateLoginInput = withValidationErrors([
  body('email')
  .notEmpty()
  .withMessage('email is required')
  .isEmail()
  .withMessage('invalid email format'),
  body('password').notEmpty().withMessage('password is required'), 
]);


export const validateUpdateUserInput = withValidationErrors([
  body('name').notEmpty().withMessage('name is required'),
  body('email')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('invalid email format')
    .custom(async (email, { req }) => {
      const currentUser = await User.findById(req.user.userId);
      if (!currentUser) throw new BadRequestError('User not found');

      // Only check if the new email is different from current one
      if (email !== currentUser.email) {
        const userWithEmail = await User.findOne({ email });
        if (userWithEmail) {
          throw new BadRequestError('email already exists');
        }
      }
    }),
  body('location').notEmpty().withMessage('location is required'),
]);
