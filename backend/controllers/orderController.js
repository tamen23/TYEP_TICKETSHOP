import mongoose from 'mongoose';
import Order from '../models/Order.js';
import EventTicket from '../models/EventTicket.js';
import UserPurchaseInfo from '../models/UserPurchaseInfo.js';
import Stripe from 'stripe';

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// Controller to handle ticket purchases
export const purchaseTickets = async (req, res) => {
  try {
    const { userId, tickets, totalAmount, userDetails, eventId } = req.body;

    console.log('Received request body:', JSON.stringify(req.body, null, 2));

    if (!tickets || tickets.length === 0) {
      console.log('No tickets provided or tickets array is empty');
      return res.status(400).json({ message: 'No tickets provided' });
    }

    console.log('Tickets array:', JSON.stringify(tickets, null, 2));

    const ticketIds = [];
    for (const ticket of tickets) {
      if (mongoose.Types.ObjectId.isValid(ticket.ticketId)) {
        ticketIds.push(new mongoose.Types.ObjectId(ticket.ticketId));
      } else {
        console.log(`Invalid ticketId: ${ticket.ticketId}`);
        return res.status(400).json({ message: `Invalid ticketId: ${ticket.ticketId}` });
      }
    }

    console.log('Ticket IDs:', ticketIds);
    console.log('Event ID being used:', eventId);

    const availableTickets = await EventTicket.find({
      _id: { $in: ticketIds },
      event: new mongoose.Types.ObjectId(eventId)
    });

    console.log("First check Available tickets fetched from database:", availableTickets);
    console.log('Available tickets fetched from database:', JSON.stringify(availableTickets, null, 2));

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

    if (userDetails && userId) {
      console.log('Saving user purchase info:', userDetails);
      const userPurchaseInfo = new UserPurchaseInfo({
        user: userId,
        ...userDetails,
      });
      await userPurchaseInfo.save();
    }

    res.status(200).json({ orderId: order._id });
  } catch (error) {
    console.error('Error in purchaseTickets:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Controller to handle payment processing with Stripe
export const processPayment = async (req, res) => {
  try {
    const { orderId } = req.params; // Get the orderId from the request parameters
    const { paymentMethodId } = req.body; // Get the paymentMethodId from the request body

    // Fetch the order by ID and populate the related ticket information
    const order = await Order.findById(orderId).populate('tickets.ticket');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Create a payment intent with Stripe
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: order.totalAmount * 100, // Stripe expects the amount in cents
      currency: 'eur',
      payment_method: paymentMethodId,
      confirm: true, // Immediately attempts to confirm the payment
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    // Handle the outcome of the payment intent
    if (paymentIntent.status === 'succeeded') {
      // Mark the order as completed upon successful payment
      order.status = 'completed';
      await order.save();

      // Update ticket availability (mark tickets as sold)
      for (const orderedTicket of order.tickets) {
        await EventTicket.updateOne(
          { _id: orderedTicket.ticket._id },
          { $inc: { sold: orderedTicket.quantity } }
        );
      }

      // Respond with a success message
      return res.status(200).json({ success: true });
    } else {
      // If payment failed, respond with an error message
      return res.status(400).json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
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

    // If user purchase info not found, respond with an error
    if (!userPurchaseInfo) {
      return res.status(404).json({ message: 'User purchase info not found' });
    }

    // Respond with the user purchase information
    res.status(200).json(userPurchaseInfo);
  } catch (error) {
    console.error('Error fetching user purchase info:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
