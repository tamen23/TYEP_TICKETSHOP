import express from 'express';
import {
  registerUser, getMe, authUser, getUsers, getUserById, updateUser, deleteUser, initiatePasswordReset, resetPassword,
} from '../controllers/authController.js';

import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
// Register a new user
router.post('/register', registerUser);

// Authenticate user & get token
router.post('/login', authUser);

// Initiate password reset
router.post('/forgotpassword', initiatePasswordReset);

// Reset password
router.post('/resetpassword', resetPassword);

// Protected route to get logged-in user's data
router.get('/me', protect, getMe);

// Protected routes (Admin only)
// Get all users
router.get('/users', protect, admin, getUsers);

// Get user by ID
router.get('/:id', protect, admin, getUserById);

// Update user
router.put('/:id', protect, admin, updateUser);

// Delete user
router.delete('/:id', protect, admin, deleteUser);

export default router;
