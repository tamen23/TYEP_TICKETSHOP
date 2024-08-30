import mongoose from 'mongoose';
import Event from '../models/Event.js';
import Order from '../models/Order.js';
import EventTicket from '../models/EventTicket.js';
import UserPurchaseInfo from '../models/UserPurchaseInfo.js';
import Stripe from 'stripe';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generateTicketPDF } from '../utils/ticketTemplate.js';
import { sendTicketEmail } from './emailController.js';  // Adjust the path accordingly

// __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Stripe instance with the secret key
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

const TICKET_STORAGE_DIR = path.join(__dirname, '../tickets'); // Directory where PDFs will be stored

// Ensure the directory exists
if (!fs.existsSync(TICKET_STORAGE_DIR)) {
  fs.mkdirSync(TICKET_STORAGE_DIR, { recursive: true });
}

// Controller to handle ticket purchases
export const purchaseTickets = async (req, res) => {
  try {
    const { userId, tickets, totalAmount, eventId } = req.body;

    console.log('Received request body:', JSON.stringify(req.body, null, 2));

    if (!tickets || tickets.length === 0) {
      console.log('No tickets provided or tickets array is empty');
      return res.status(400).json({ message: 'No tickets provided' });
    }

    console.log('Tickets array:', JSON.stringify(tickets, null, 2));

    // Convert ticket IDs to MongoDB ObjectId
    const ticketIds = tickets.map(ticket => new mongoose.Types.ObjectId(ticket.ticketId));
    console.log('Ticket IDs:', ticketIds);

    // Check available tickets for the event
    const availableTickets = await EventTicket.find({
      _id: { $in: ticketIds },
      event: new mongoose.Types.ObjectId(eventId)
    });

    console.log("First check Available tickets fetched from database:", availableTickets);

    // If some tickets are not available, respond with an error
    if (availableTickets.length !== tickets.length) {
      const missingTickets = tickets.filter(
        ticket => !availableTickets.some(availableTicket => availableTicket._id.equals(ticket.ticketId))
      );
      console.log('Some tickets are not available:', missingTickets);
      return res.status(400).json({
        message: 'Some tickets are not available',
        missingTickets: missingTickets.map(ticket => ticket.ticketId),
      });
    }

    // Create a new order in the database
    const order = new Order({
      user: userId,
      event: eventId,
      tickets: tickets.map(ticket => ({
        ticket: ticket.ticketId,
        quantity: ticket.quantity,
      })),
      totalAmount,
      status: 'pending',
    });

    console.log('Order to be saved:', JSON.stringify(order, null, 2));
    await order.save();

    // Respond with the created order's ID
    res.status(200).json({ orderId: order._id });
  } catch (error) {
    console.error('Error in purchaseTickets:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller to handle payment processing with Stripe
export const processPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentMethodId, userDetails } = req.body;

    console.log('Received userDetails:', JSON.stringify(userDetails, null, 2));

    if (!userDetails || !userDetails.email) {
      console.log('User details are missing or incomplete.');
      return res.status(400).json({ message: 'User details are missing or incomplete.' });
    }

    console.log('Fetching order details...');
    const order = await Order.findById(orderId)
      .populate('tickets.ticket')
      .populate('user');
    if (!order) {
      console.log('Order not found:', orderId);
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('Fetching event details...');
    const event = await Event.findById(order.event);
    if (!event) {
      console.log('Event not found:', order.event);
      return res.status(404).json({ message: 'Event not found' });
    }

    console.log('Creating payment intent...');
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: order.totalAmount * 100,
      currency: 'eur',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    if (paymentIntent.status === 'succeeded') {
      console.log('Payment succeeded for order:', orderId);

      order.status = 'completed';
      await order.save();
      console.log('Order status updated to completed');

      for (const orderedTicket of order.tickets) {
        await EventTicket.updateOne(
          { _id: orderedTicket.ticket._id },
          { $inc: { sold: orderedTicket.quantity } }
        );
      }
      console.log('Ticket sales updated for each ticket in the order');

      if (userDetails) {
        let userPurchaseInfo;

        if (order.user) {
          userPurchaseInfo = await UserPurchaseInfo.findOne({ user: order.user });
          if (!userPurchaseInfo) {
            userPurchaseInfo = new UserPurchaseInfo({
              user: order.user,
              ...userDetails,
            });
          } else {
            userPurchaseInfo.set(userDetails);
          }
        } else {
          userPurchaseInfo = new UserPurchaseInfo(userDetails);
        }
        await userPurchaseInfo.save();
        console.log('User purchase information saved or updated');
      }

      // Start ticket generation process
      console.log('Generating tickets after payment...');
      await generateTickets(order, event, userDetails);

      // Send the success response immediately
      res.status(200).json({ success: true });
    } else {
      console.log('Payment failed for order:', orderId);
      return res.status(400).json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Function to generate tickets after successful payment
const generateTickets = async (order, event, userDetails) => {
  console.log('Starting to generate PDFs for tickets...');
  
  for (const ticket of order.tickets) {
    try {
      const pdfFileName = `${ticket._id}_ticket.pdf`;
      const pdfFilePath = path.join(TICKET_STORAGE_DIR, pdfFileName);

      console.log('Generating PDF for ticket:', ticket._id);
      await generateTicketPDF(order, ticket.ticket, event, userDetails, pdfFilePath);
      console.log(`Ticket generated at: ${pdfFilePath}`);
    } catch (error) {
      console.error(`Error generating ticket PDF for ticket ${ticket._id}:`, error);
      throw new Error('Ticket generation failed');
    }
  }

  console.log('All tickets generated successfully. Preparing to send email...');
  try {
    console.log('User details for email:', JSON.stringify(userDetails));
    await sendTicketEmail(order, event, userDetails);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending ticket email:', error);
    console.error('Error details:', error.response ? error.response.body : error.message);
    throw new Error('Failed to send ticket email');
  }
};

// Controller to get order details with detailed logging
export const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Log incoming orderId for debugging
    console.log('Fetching order details for orderId:', orderId);

    // Check if orderId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.log('Invalid order ID:', orderId);
      return res.status(400).json({ msg: 'Invalid order ID' });
    }

    // Fetch the order details by ID and populate related ticket and event information
    const order = await Order.findById(orderId).populate({
      path: 'tickets.ticket',
      populate: { path: 'event' } // Also populate the event related to each ticket
    });

    // If order not found, respond with an error
    if (!order) {
      console.log('Order not found for ID:', orderId);
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Log the full order details for debugging
    console.log('Order found:', JSON.stringify(order, null, 2));
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Controller to get user purchase information
export const getUserPurchaseInfo = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the user purchase information by userId
    const userPurchaseInfo = await UserPurchaseInfo.findOne({ user: userId });

    // If user purchase info is found, respond with it
    if (userPurchaseInfo) {
      return res.status(200).json(userPurchaseInfo);
    }

    // If user purchase info is not found, respond with a specific message
    return res.status(404).json({ message: 'User purchase info not found' });

  } catch (error) {
    console.error('Error fetching user purchase info:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
