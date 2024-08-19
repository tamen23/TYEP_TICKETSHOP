import mongoose from 'mongoose';

// Define the schema for orders
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Optional for guest users
  email: {
    type: String,
    required: function () {
      return !this.user; // Email is required only if there's no user ID
    },
  }, // Conditionally required
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  tickets: [
    {
      ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'EventTicket', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
}, {
  timestamps: true,
});

// Create the Order model
const Order = mongoose.model('Order', orderSchema);
export default Order;
