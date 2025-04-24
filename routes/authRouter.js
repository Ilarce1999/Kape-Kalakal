import { Router } from 'express';
const router = Router(); // Instantiate the router
import { login, logout, register } from '../controllers/authController.js';
import { validateRegisterInput, validateLoginInput } from '../middleware/validationMiddleware.js';



// Define routes
router.post('/register', validateRegisterInput, register);
router.post('/login', validateLoginInput, login);
router.get('/logout', logout)

export default router;
