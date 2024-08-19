import mongoose from 'mongoose';

// Define the schema for event tickets
const eventTicketSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }, // Reference to the Event model
  category: { type: String, required: true }, // Category of the ticket (e.g., VIP, General)
  price: { type: Number, required: true }, // Price of the ticket
  count: { type: Number, required: true }, // Total number of tickets available
  sold: { type: Number, default: 0 }, // Number of tickets sold
}, {
  timestamps: true, // Automatically create `createdAt` and `updatedAt` fields
});

// Create the EventTicket model
const EventTicket = mongoose.model('EventTicket', eventTicketSchema);
export default EventTicket;
