import {Router} from 'express'
const router = Router()

import {getAllDrinks,
        getDrink,
        createDrink,
        editDrink,
        deleteDrink

} from '../controllers/drinkController.js';
import { validateDrinkOrder, validateIdParam } from '../middleware/validationMiddleware.js';

router.route('/').get(getAllDrinks).post(validateDrinkOrder, createDrink)
router.route('/:id').get(validateIdParam, getDrink).patch(validateDrinkOrder, validateIdParam, editDrink).delete(validateIdParam, 
        deleteDrink)

export default router;
