// routes/orderRoutes.js
import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrder,     
  editOrder,
  deleteOrder
} from '../controllers/drinkController.js';

import {
  validateOrder,
  validateIdParam
} from '../middleware/validationMiddleware.js';

import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateUser); // All routes below require authentication

// Routes for order operations
router.route('/')
  .get(getAllOrders)           
  .post(validateOrder, createOrder);  // Create a new order

router.route('/:id')
  .get(validateIdParam, getOrder)         
  .patch(validateOrder, validateIdParam, editOrder)  
  .delete(validateIdParam, deleteOrder);  

export default router