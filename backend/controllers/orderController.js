import mongoose from 'mongoose';
import Order from '../models/Order.js';
import EventTicket from '../models/EventTicket.js';
import UserPurchaseInfo from '../models/UserPurchaseInfo.js';
import Stripe from 'stripe';

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// Controller to handle ticket purchases
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

        const ticketIds = tickets.map(ticket => new mongoose.Types.ObjectId(ticket.ticketId));
        console.log('Ticket IDs:', ticketIds);

        const availableTickets = await EventTicket.find({
            _id: { $in: ticketIds },
            event: new mongoose.Types.ObjectId(eventId)
        });

        console.log("First check Available tickets fetched from database:", availableTickets);

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

        // Logic for saving user purchase information
        let userPurchaseInfo;

        if (userId) {
            // If user is logged in, check if the user purchase info already exists
            userPurchaseInfo = await UserPurchaseInfo.findOne({ user: userId });

            if (!userPurchaseInfo) {
                // If it doesn't exist, create a new one
                console.log('Saving new user purchase info for logged-in user:', userDetails);
                userPurchaseInfo = new UserPurchaseInfo({
                    user: userId,
                    ...userDetails,
                });
                await userPurchaseInfo.save();
            } else {
                console.log('User purchase info already exists for logged-in user. No new record created.');
            }

        } else {
            // If user is not logged in (guest), check by email
            userPurchaseInfo = await UserPurchaseInfo.findOne({ email: userDetails.email });

            if (!userPurchaseInfo) {
                // If no record exists for the provided email, create a new one
                console.log('Saving new user purchase info for non-logged-in user:', userDetails);
                userPurchaseInfo = new UserPurchaseInfo({
                    ...userDetails, // Since there's no userId, we only save the userDetails
                });
                await userPurchaseInfo.save();
            } else {
                console.log('User purchase info already exists for the provided email. No new record created.');
            }
        }

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

