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
import moment from 'moment';

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

    // Validate user details
    if (!userDetails || !userDetails.email) {
      console.log('User details are missing or incomplete.');
      return res.status(400).json({ message: 'User details are missing or incomplete.' });
    }

    // Fetch order details
    console.log('Fetching order details...');
    const order = await Order.findById(orderId).populate('tickets.ticket').populate('user');
    if (!order) {
      console.log('Order not found:', orderId);
      return res.status(404).json({ message: 'Order not found' });
    }

    // Fetch event details
    console.log('Fetching event details...');
    const event = await Event.findById(order.event);
    if (!event) {
      console.log('Event not found:', order.event);
      return res.status(404).json({ message: 'Event not found' });
    }

    // Create payment intent
    console.log('Creating payment intent...');
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: order.totalAmount * 100, // Convert to cents
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

      // Update order status
      order.status = 'completed';
      await order.save();
      console.log('Order status updated to completed');

      // Update ticket sales
      for (const orderedTicket of order.tickets) {
        await EventTicket.updateOne(
          { _id: orderedTicket.ticket._id },
          { $inc: { sold: orderedTicket.quantity } }
        );
      }
      console.log('Ticket sales updated for each ticket in the order');

      // Save or update user purchase information
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

      // Generate tickets
      console.log('Generating tickets after payment...');
      const generatedTickets = await generateTickets(order, event, userDetails);

      if (generatedTickets.length === 0) {
        console.error('No tickets were generated.');
        return res.status(500).json({ success: false, message: 'Failed to generate tickets' });
      }

      // Save the generated tickets to the order
      order.generatedTickets = generatedTickets;
      await order.save();
      console.log('Tickets successfully generated and saved to the order.');

      // Send the success response
      res.status(200).json({ success: true, message: 'Payment processed and tickets generated successfully', orderId: order._id });
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
  
  const generatedTickets = [];

  for (const ticketOrder of order.tickets) {
    try {
      const dateTimeStamp = moment().format('YYYYMMDD_HHmmss');
      const pdfFileName = `${dateTimeStamp}_${ticketOrder.ticket._id}_ticket.pdf`;
      const pdfFilePath = path.join(TICKET_STORAGE_DIR, pdfFileName);

      console.log('Generating PDF for ticket:', ticketOrder.ticket._id);
      
      // Generate the ticket PDF (ensure `generateTicketPDF` correctly saves the PDF)
      await generateTicketPDF(order, ticketOrder.ticket, event, userDetails, pdfFilePath);

      // Verify if the PDF file exists and then add to the array
      if (fs.existsSync(pdfFilePath)) {
        console.log(`File confirmed at: ${pdfFilePath}`);
        generatedTickets.push({
          ticketId: ticketOrder.ticket._id,
          pdfPath: pdfFilePath
        });
      } else {
        console.error(`File not found after save attempt: ${pdfFilePath}`);
      }

      console.log(`Ticket generated at: ${pdfFilePath}`);
    } catch (error) {
      console.error(`Error generating ticket PDF for ticket ${ticketOrder.ticket._id}:`, error);
      throw new Error('Ticket generation failed');
    }
  }

  console.log('Generated Tickets:', JSON.stringify(generatedTickets, null, 2)); 
  return generatedTickets;
};



// Controller to handle email sending
export const triggerTicketEmail = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await sendTicketEmail(orderId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error triggering ticket email:', error);
    res.status(500).json({ success: false, message: 'Failed to send ticket email' });
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


// Controller to fetch all orders for a specific user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all orders for the specified user
    const orders = await Order.find({ user: userId }).populate('event').populate('tickets.ticket');

    // If orders are found, return them
    if (orders && orders.length > 0) {
      return res.status(200).json(orders);
    }

    // If no orders found, return an empty array
    return res.status(404).json({ message: 'No orders found for this user' });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const downloadTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Find the order that contains the ticket
    const order = await Order.findOne({ "generatedTickets.ticketId": ticketId });

    if (!order) {
      console.log('Ticket not found:', ticketId);
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Find the correct ticket within the order's generatedTickets array
    const ticket = order.generatedTickets.find(t => t.ticketId.toString() === ticketId);

    if (!ticket || !ticket.pdfPath) {
      console.log('Ticket not found or no PDF path:', ticketId);
      return res.status(404).json({ message: 'Ticket not found or PDF path missing' });
    }

    // Resolve the file path and serve it for download
    const filePath = path.resolve(ticket.pdfPath);
    console.log('Resolved file path:', filePath);
    res.download(filePath);
  } catch (error) {
    console.error('Error downloading ticket:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
