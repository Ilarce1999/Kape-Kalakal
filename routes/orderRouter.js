import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrder,
  editOrder,
  deleteOrder,
  getMyOrders // ✅ Import new controller
} from '../controllers/orderController.js';

import {
  validateOrder,
  validateIdParam
} from '../middleware/validationMiddleware.js';

import { authenticateUser } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRoleMiddleware.js';

const router = Router();

// ✅ All routes below require login
router.use(authenticateUser);

// ✅ New route: fetch orders of the logged-in user
router.get('/my-orders', getMyOrders);

// ✅ Only admins can get all orders
router.route('/')
  .get(checkRole(['admin', 'superadmin']), getAllOrders)
  .post(validateOrder, createOrder);

router.route('/:id')
  .get(validateIdParam, getOrder)
  .patch(validateOrder, validateIdParam, editOrder)
  .delete(validateIdParam, deleteOrder);

export default router;
