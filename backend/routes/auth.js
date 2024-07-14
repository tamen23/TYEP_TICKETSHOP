import express from 'express';
import {
  registerUser, getMe, authUser, getUsers, getUserById, updateUser, deleteUser, initiatePasswordReset, resetPassword,
} from '../controllers/authController.js';

import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
// Register a new user
router.post('/register', registerUser); // Public

// Authenticate user & get token
router.post('/login', authUser); // Public

// Initiate password reset
router.post('/forgotpassword', initiatePasswordReset); // Public

// Reset password
router.post('/resetpassword', resetPassword); // Public

// In your auth.js routes file
router.get('/me', protect, getMe); // Protected route to get logged-in user's data



// Protected routes (Admin only)
// Get all users
router.get('/', protect, admin, getUsers); // Admin

// Get user by ID
router.get('/:id', protect, admin, getUserById); // Admin

// Update user
router.put('/:id', protect, admin, updateUser); // Admin

// Delete user
router.delete('/:id', protect, admin, deleteUser); // Admin

export default router;
