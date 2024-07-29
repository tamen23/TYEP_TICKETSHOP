import Event from '../models/Event.js';

// Controller to create a new event
export const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    event.validateUserRole(req.user); // Validate user role
    const savedEvent = await event.save(); // Save event to database
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error(error);
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

    event.validateUserRole(req.user); // Validate user role
    Object.assign(event, req.body); // Update event with new data
    const updatedEvent = await event.save(); // Save updated event to database
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Controller to get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};
