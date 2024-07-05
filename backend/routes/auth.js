import express from 'express';
import {
  registerUser, authUser, getUsers, getUserById, updateUser, deleteUser, initiatePasswordReset, resetPassword,
} from '../controllers/authController.js';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Authenticate user & get token
router.post('/login', authUser);

// Get all users
router.get('/', getUsers);

// Get user by ID
router.get('/:id', getUserById);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

// Initiate password reset
router.post('/forgotpassword', initiatePasswordReset);

// Reset password
router.post('/resetpassword', resetPassword);

export default router;
