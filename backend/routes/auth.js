import express from 'express';
import {
  registerUser, authUser, getUsers, getUserById, updateUser, deleteUser, initiatePasswordReset, resetPassword,
} from '../controllers/authController.js';

import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Authenticate user & get token
router.post('/login', authUser);

// Get all users
router.get('/', protect, admin, getUsers);

// Get user by ID
router.get('/:id', protect, admin, getUserById);

// Update user
router.put('/:id', protect, admin, updateUser);

// Delete user
router.delete('/:id', protect, admin, deleteUser);

// Initiate password reset
router.post('/forgotpassword', initiatePasswordReset);

// Reset password
router.post('/resetpassword', resetPassword);

export default router;