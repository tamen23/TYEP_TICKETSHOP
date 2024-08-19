import mongoose from 'mongoose';
import EventTicket from '../models/EventTicket.js';
import Order from '../models/Order.js';
import UserPurchaseInfo from '../models/UserPurchaseInfo.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Controller to get tickets by event ID
export const getTicketsByEvent = async (req, res) => {
  try {
    const tickets = await EventTicket.find({ event: req.params.eventId });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

