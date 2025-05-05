import express from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import upload from '../middleware/multerMiddleware.js'; // centralized multer config


const router = express.Router();

// GET all products
router.get('/', getAllProducts);

// POST create a new product with image upload
router.post('/', upload.single('image'), createProduct);

// PUT update a product by ID (with optional image upload)
router.put('/:id', upload.single('image'), updateProduct);

// DELETE a product by ID
router.delete('/:id', deleteProduct);

export default router;
