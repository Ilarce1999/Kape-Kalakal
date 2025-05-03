import { Router } from 'express';  // <-- This is missing in your code
import {
  getAppStats,
  getCurrentUser,
  updateUser,
  getSuperAdminData,
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById
} from '../controllers/userController.js';

import { validateUpdateUserInput } from '../middleware/validationMiddleware.js';
import { authorizePermissions } from '../middleware/authMiddleware.js';

const router = Router();  // <-- Now router is defined

// Only superadmin can access this
router.get('/superadmin/data', authorizePermissions('superadmin'), getSuperAdminData);

// Admin and superadmin can view stats
router.get('/admin/app-stats', authorizePermissions('admin', 'superadmin'), getAppStats);

// All authenticated users (even basic ones) can do this
router.get('/current-user', getCurrentUser);

router.patch('/update-user', validateUpdateUserInput, updateUser);

// Super admin can access the user data


// Super admin can manage all users
router.get('/users', authorizePermissions('superadmin'), getAllUsers);
router.get('/users/:id', authorizePermissions('superadmin'), getUserById);
router.post('/users', authorizePermissions('superadmin'), createUser);
router.patch('/users/:id', authorizePermissions('superadmin'), updateUserById);
router.delete('/users/:id', authorizePermissions('superadmin'), deleteUserById);

export default router;
