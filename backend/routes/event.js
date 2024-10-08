import express from 'express';
import { createEvent, updateEvent, deleteEvent, getEventById, getAllEvents, updateEventStatus, getEventsByOrganizer, getApprovedEvents } from '../controllers/eventController.js';
import { protect, adminOrOrganisateur, admin } from '../middlewares/authMiddleware.js';
import { uploadImages } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Route to create a new event
router.post('/create', protect, adminOrOrganisateur, uploadImages, createEvent);
// Route to get all events by organizer
router.get('/organizer', protect, adminOrOrganisateur, getEventsByOrganizer);

// Route to update an existing event
router.put('/:id', protect, adminOrOrganisateur, uploadImages, updateEvent);

// Route to delete an event
router.delete('/:id', protect, adminOrOrganisateur, deleteEvent);

// Route to get all approved events
router.get('/approved', getApprovedEvents);

// Route to get a specific event by ID
router.get('/:id',  getEventById);

// Route to get all events
router.get('/', protect, getAllEvents);

// Route to approve an event (admin only)
router.put('/:id/status', protect, admin, updateEventStatus);




export default router;
