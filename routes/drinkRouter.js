import { Router } from 'express';
import {
  getAllDrinks,
  getDrink,
  createDrink,
  editDrink,
  deleteDrink
} from '../controllers/drinkController.js';

import {
  validateDrinkOrder,
  validateIdParam
} from '../middleware/validationMiddleware.js';

const router = Router();

// Routes for drink orders
router.route('/')
  .get(getAllDrinks)  // Fetch all drinks
  .post(validateDrinkOrder, createDrink);  // Create a new drink order

router.route('/:id')
  .get(validateIdParam, getDrink)  // Get specific drink order by ID
  .patch(validateDrinkOrder, validateIdParam, editDrink)  // Edit a drink order
  .delete(validateIdParam, deleteDrink);  // Delete a drink order

export default router;