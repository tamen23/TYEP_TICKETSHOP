import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware.js';
import User from '../models/User.js';  // Assuming you have a User model

const router = express.Router();

// Route to get all organizers
router.get('/organizers', protect, admin, async (req, res) => {
  try {
    const organizers = await User.find({ role: 'organisateur' }, 'name email');  // Adjust fields as needed
    res.status(200).json(organizers);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Route to get all users
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}, 'name email role');  // Adjust fields as needed
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
