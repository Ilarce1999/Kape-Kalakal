import { Router } from 'express';
import {
  getAppStats,
  getCurrentUser,
  updateUser,
  getSuperAdminData, // <-- Make sure this function exists in your controller
} from '../controllers/userController.js';

import { validateUpdateUserInput } from '../middleware/validationMiddleware.js';
import { authorizePermissions } from '../middleware/authMiddleware.js';

const router = Router();

// Only superadmin can access this
router.get('/superadmin/data', authorizePermissions('superadmin'), getSuperAdminData);

// Admin and superadmin can view stats
router.get('/admin/app-stats', authorizePermissions('admin', 'superadmin'), getAppStats);

// All authenticated users (even basic ones) can do this
router.get('/current-user', getCurrentUser);

router.patch('/update-user', validateUpdateUserInput, updateUser);

export default router;