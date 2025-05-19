import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrder,
  editOrder,
  deleteOrder,
  updateOrderStatus,
  getMyOrders,
} from '../controllers/orderController.js';

import {
  validateOrder,
  validateIdParam,
  validateOrderStatusUpdate,
} from '../middleware/validationMiddleware.js';

import { authenticateUser } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRoleMiddleware.js';

const router = Router();

// All routes below require authentication
router.use(authenticateUser);

// Route: fetch orders of the logged-in user
router.get('/my-orders', getMyOrders);

// Route: get all orders (admin/superadmin only)
router.get('/', checkRole(['admin', 'superadmin']), getAllOrders);

// Route: create a new order (only users with role "user")
router.post('/', checkRole(['user']), validateOrder, createOrder);

// Route: update only delivery/payment status (admin and superadmin only)
router.patch('/:id/status', validateIdParam, validateOrderStatusUpdate, updateOrderStatus);


// Routes for specific order by ID
router
  .route('/:id')
  // Validate ID param before accessing order
  .get(validateIdParam, getOrder)
  // For PATCH, validate ID param first, then validate order body
  .patch(validateIdParam, validateOrder, editOrder)
  .delete(validateIdParam, deleteOrder);

export default router;
