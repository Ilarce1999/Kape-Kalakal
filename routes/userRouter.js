import { Router } from 'express';
import {
  getAppStats,
  getCurrentUser,
  updateUser,
  updatePassword,
  getSuperAdminData,
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} from '../src/controllers/userController.js';

import { validateUpdateUserInput } from '../middleware/validationMiddleware.js';
import {
  authorizePermissions,
  authenticateUser,
} from '../middleware/authMiddleware.js';

const router = Router();

router.get('/superadmin/data', authenticateUser, authorizePermissions('superadmin'), getSuperAdminData);
router.get('/admin/app-stats', authenticateUser, authorizePermissions('admin', 'superadmin'), getAppStats);
router.get('/current-user', authenticateUser, getCurrentUser);
router.patch('/update-user', authenticateUser, validateUpdateUserInput, updateUser);

// ✅ Password update route
router.patch('/update-password', authenticateUser, updatePassword);

router.get('/users', authenticateUser, authorizePermissions('superadmin'), getAllUsers);
router.get('/users/:id', authenticateUser, authorizePermissions('superadmin'), getUserById);
router.post('/users', authenticateUser, authorizePermissions('superadmin'), createUser);
router.patch('/users/:id', authenticateUser, authorizePermissions('user', 'superadmin'), updateUserById);
router.delete('/users/:id', authenticateUser, authorizePermissions('superadmin'), deleteUserById);

export default router;
