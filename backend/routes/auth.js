import express from 'express';
import { registerUser, authUser } from '../controllers/authController.js';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Authenticate user & get token
router.post('/login', authUser);

export default router;
