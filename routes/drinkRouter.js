// routes/orderRoutes.js
import { Router } from 'express';
import {
  getAllOrders,
  getOrder,
  createOrder,
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
  .get(getAllOrders)            // Fetch all orders
  .post(validateOrder, createOrder);  // Create a new order

router.route('/:id')
  .get(validateIdParam, getOrder)         // Get a specific order by ID
  .patch(validateOrder, validateIdParam, editOrder)  // Update an order
  .delete(validateIdParam, deleteOrder);  // Delete an order

export default router