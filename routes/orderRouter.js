import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrder,
  editOrder,
  deleteOrder
} from '../controllers/orderController.js';

import {
  validateOrder,
  validateIdParam
} from '../middleware/validationMiddleware.js';

import { authenticateUser } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRoleMiddleware.js'; // ✅ Import checkRole

const router = Router();

// ✅ All routes require authentication
router.use(authenticateUser);

// ✅ Restrict GET / to admin/superadmin only
router.route('/')
  .get(checkRole(['admin', 'superadmin']), getAllOrders) // Only these roles can view all orders
  .post(validateOrder, createOrder); // Any authenticated user can create an order

router.route('/:id')
  .get(validateIdParam, getOrder)
  .patch(validateOrder, validateIdParam, editOrder)
  .delete(validateIdParam, deleteOrder);

export default router;
