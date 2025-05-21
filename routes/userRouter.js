import { Router } from 'express';  // <-- Import Router
import {
  getAppStats,
  getCurrentUser,
  updateUser,
  getSuperAdminData,
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} from '../controllers/userController.js';

import { validateUpdateUserInput } from '../middleware/validationMiddleware.js';
import { authorizePermissions } from '../middleware/authMiddleware.js';

const router = Router();  // <-- Define the router

// Only superadmin can access this
router.get('/superadmin/data', authorizePermissions('superadmin'), getSuperAdminData);

// Admin and superadmin can view stats
router.get('/admin/app-stats', authorizePermissions('admin', 'superadmin'), getAppStats);

// All authenticated users (even basic ones) can do this
router.get('/current-user', getCurrentUser);

// Update user information
router.patch('/update-user', validateUpdateUserInput, updateUser);

// Super admin can manage all users
router.get('/users', authorizePermissions('superadmin'), getAllUsers);  // List all users
router.get('/users/:id', authorizePermissions('superadmin'), getUserById);  // Get user by ID
router.post('/users', authorizePermissions('superadmin'), createUser);  // Create a new user
router.patch('/users/:id', authorizePermissions('user', 'superadmin'), updateUserById);  // Update user by ID
router.delete('/users/:id', authorizePermissions('superadmin'), deleteUserById);  // Hard delete user by ID

export default router;
