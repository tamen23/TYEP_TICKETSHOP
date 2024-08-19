import express from 'express';
import { getTicketsByEvent } from '../controllers/ticketController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to get tickets by event ID
router.get('/:eventId', getTicketsByEvent);

export default router;
