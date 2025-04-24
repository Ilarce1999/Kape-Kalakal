import { Router } from 'express';
const router = Router(); // Instantiate the router
import { login, register } from '../controllers/authController.js';
import { validateRegisterInput, validateLoginInput } from '../middleware/validationMiddleware.js';



// Define routes
router.post('/register', validateRegisterInput, register);
router.post('/login', validateLoginInput, login);

export default router;
