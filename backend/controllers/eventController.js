import Event from '../models/Event.js';

// Controller to create a new event
export const createEvent = async (req, res) => {
  try {
    const {
      name, venue, street_address, postal_code, city, country, category, sub_category, target_audience, description, images, date,
      start_time, end_time, duration, pricing, capacity, seatCategories, simple_count, vip_count, premium_count, simple_price,
      vip_price, premium_price, recurring, recurrence
    } = req.body;

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
      name, venue, street_address, postal_code, city, country, category, sub_category, target_audience, description, images, date,
      start_time, end_time, duration, pricing, capacity,
      seat_categories: seatCategoriesData, recurring, recurrence: recurring ? recurrence : undefined, status: 'pending approval'
    });

    event.validateUserRole(req.user); // Validate user role
    const savedEvent = await event.save(); // Save event to database
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ msg: 'Server error' });
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
      name, venue, street_address, postal_code, city, country, category, sub_category, target_audience, description, images, date,
      start_time, end_time, duration, pricing, capacity, seatCategories, simple_count, vip_count, premium_count, simple_price,
      vip_price, premium_price, recurring, recurrence
    } = req.body;

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
      recurring, recurrence: recurring ? recurrence : undefined
    });

    event.validateUserRole(req.user); // Validate user role
    const updatedEvent = await event.save(); // Save updated event to database
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ msg: 'Server error' });
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
    await event.remove(); // Remove event from database
    res.status(200).json({ msg: 'Event removed' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Controller to get a specific event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Controller to get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Controller to approve an event (admin only)
export const approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    event.status = 'approved';
    const approvedEvent = await event.save();
    res.status(200).json(approvedEvent);
  } catch (error) {
    console.error('Error approving event:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};
