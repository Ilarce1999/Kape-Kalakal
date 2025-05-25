import { Router } from 'express';
import multer from '../middleware/multerMiddleware.js'; // your multer config
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  decreaseProductStock
} from '../controllers/productController.js';

import { authenticateUser } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRoleMiddleware.js';

const router = Router();

// All routes below require login
router.use(authenticateUser);

// Product routes
router.route('/')
  .get(getAllProducts)
  // Use multer middleware to handle single image upload
  .post(checkRole(['admin', 'superadmin']), multer.single('image'), createProduct);

router.route('/:id')
  .get(getProductById)
  // Patch route with multer middleware to optionally update image
  .patch(checkRole(['admin', 'superadmin']), multer.single('image'), updateProduct)
  .delete(checkRole(['admin', 'superadmin']), deleteProduct);

// Route to decrease stock during an order
router.patch('/:id/decrease-stock', decreaseProductStock);

export default router;
