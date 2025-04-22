import {Router} from 'express'
const router = Router()

import {getAllDrinks,
        getDrink,
        createDrink,
        editDrink,
        deleteDrink

} from '../controllers/drinkController.js';

router.route('/').get(getAllDrinks).post(createDrink)
router.route('/:id').get(getDrink).patch(editDrink).delete(deleteDrink)

export default router;
