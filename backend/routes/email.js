import express from 'express';
import { storeEmail } from '../controllers/emailController.js';

const router = express.Router();

// Route to handle email storage
router.post('/storeEmail', storeEmail);

export default router;