import mongoose from 'mongoose';
import Event from '../models/Event.js';
import EventTicket from '../models/EventTicket.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Manually construct __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Controller to create a new event
export const createEvent = async (req, res) => {
  try {
    const {
      name, venue, street_address, postal_code, city, country, category, sub_category, target_audience, description, date,
      start_time, end_time, duration, pricing, capacity, seatCategories, simple_count, vip_count, premium_count, simple_price,
      vip_price, premium_price, recurring, recurrence
    } = req.body;

    const images = req.files ? req.files.map(file => file.path.replace(/\\/g, '/')) : []; // Normalize paths

    // Ensure target_audience is an array
    const targetAudienceArray = target_audience.split(',');


    // Construct seat categories array
    const seatCategoriesData = [];
    if (seatCategories.includes('simple')) {
      seatCategoriesData.push({ type: 'simple', count: simple_count, price: pricing === 'paid' ? simple_price : 0 });
    }
    if (seatCategories.includes('vip')) {
      seatCategoriesData.push({ type: 'vip', count: vip_count, price: pricing === 'paid' ? vip_price : 0 });
    }
    if (seatCategories.includes('premium')) {
      seatCategoriesData.push({ type: 'premium', count: premium_count, price: pricing === 'paid' ? premium_price : 0 });
    }

    const event = new Event({
      organizer_id: req.user._id,
      name, venue, street_address, postal_code, city, country, category, sub_category, target_audience: targetAudienceArray, description, images, date,
      start_time, end_time, duration, pricing, capacity,
      seat_categories: seatCategoriesData, recurring: recurring === 'true', recurrence: recurring === 'true' ? recurrence : undefined, status: 'draft'
    });

    event.validateUserRole(req.user); // Validate user role
    const savedEvent = await event.save(); // Save event to database
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Controller to update an existing event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    const {
      name, venue, street_address, postal_code, city, country, category, sub_category, target_audience, description, date,
      start_time, end_time, duration, pricing, capacity, seatCategories, simple_count, vip_count, premium_count, simple_price,
      vip_price, premium_price, recurring, recurrence
    } = req.body;

    const images = req.files ? req.files.map(file => file.path.replace(/\\/g, '/')) : event.images; // Normalize paths

    // Construct seat categories array
    const seatCategoriesData = [];
    if (seatCategories.includes('simple')) {
      seatCategoriesData.push({ type: 'simple', count: simple_count, price: pricing === 'paid' ? simple_price : 0 });
    }
    if (seatCategories.includes('vip')) {
      seatCategoriesData.push({ type: 'vip', count: vip_count, price: pricing === 'paid' ? vip_price : 0 });
    }
    if (seatCategories.includes('premium')) {
      seatCategoriesData.push({ type: 'premium', count: premium_count, price: pricing === 'paid' ? premium_price : 0 });
    }

    Object.assign(event, {
      name, venue, street_address, postal_code, city, country, category, sub_category, target_audience,
      description, images, date, start_time, end_time, duration, pricing, capacity, seat_categories: seatCategoriesData,
      recurring: recurring === 'true', recurrence: recurring === 'true' ? recurrence : undefined
    });

    event.validateUserRole(req.user); // Validate user role
    const updatedEvent = await event.save(); // Save updated event to database
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Controller to delete an event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    event.validateUserRole(req.user); // Validate user role
    // Delete images associated with the event
    if (event.images && event.images.length > 0) {
      event.images.forEach(image => {
        const imagePath = path.join(__dirname, '..', image);
        fs.unlink(imagePath, err => {
          if (err) console.error('Error deleting image:', err);
        });
      });
    }

    await Event.findByIdAndDelete(req.params.id); // Use findByIdAndDelete to remove the event
    res.status(200).json({ msg: 'Event removed' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};


/// Controller to get a specific event by ID
export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      console.log('Invalid event ID:', eventId);
      return res.status(400).json({ msg: 'Invalid event ID' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      console.log('Event not found for ID:', eventId);
      return res.status(404).json({ msg: 'Event not found' });
    }
    console.log('Event found:', event);
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Controller to get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('organizer_id', 'nom prenom nomDeStructure email telephone');
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Controller to update the status of an event (admin only)
export const updateEventStatus = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { status } = req.body;
    if (!['draft', 'approved', 'canceled'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }

    // Update event status
    event.status = status;
    const updatedEvent = await event.save();

    // Create tickets if the event is approved and tickets haven't been created yet
    if (status === 'approved') {
      // Check if tickets already exist for this event
      const existingTickets = await EventTicket.find({ event: event._id });
      if (existingTickets.length === 0) {
        const tickets = [];

        // Generate tickets based on seat categories
        event.seat_categories.forEach(category => {
          tickets.push({
            event: event._id,
            category: category.type,
            price: category.price,
            count: category.count,
            sold: 0,
          });
        });

        // Insert the generated tickets into the database
        await EventTicket.insertMany(tickets);
      }
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event status:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Controller to get all approved events
export const getApprovedEvents = async (req, res) => {
  try {
    console.log('Fetching approved events...');

    const events = await Event.find({ status: 'approved' }).populate('organizer_id', 'nom prenom nomDeStructure email telephone');

    console.log('Approved events fetched successfully:', events);

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching approved events:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};
// Controller to fetch all events by organizer
export const getEventsByOrganizer = async (req, res) => {
  try {
    const events = await Event.find({ organizer_id: req.user._id });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};
