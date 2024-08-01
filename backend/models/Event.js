import mongoose from 'mongoose';

// Schema for seat categories
const seatCategorySchema = new mongoose.Schema({
  type: { type: String, enum: ['simple', 'vip', 'premium'], required: true },
  count: { type: Number, required: true },
  price: { type: Number, required: function() { return this.pricing === 'paid'; } } // Only required if the event is paid
});

// Base schema for events
const baseEventSchema = new mongoose.Schema({
  organizer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  venue: { type: String, required: true },
  street_address: { type: String, required: true },
  postal_code: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  images: [{ type: String }],
  target_audience: [{ type: String, enum: ['children', 'adult', 'family', 'all'], required: true }],
  description: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  category: { type: String, required: true, enum: ['Cultural', 'Sport', 'Conference/Seminar'] },
  sub_category: { type: String, required: true, enum: ['Festival', 'Art Exhibition', 'Theater Performance', 'Concert', 'Single Match', 'Academic Conference', 'Professional Development Workshop'] },
  capacity: { type: Number, required: true },
  pricing: { type: String, required: true, enum: ['free', 'paid'] },
  seat_categories: [seatCategorySchema], // Embedded seat categories schema
  status: { type: String, enum: ['draft', 'pending approval', 'approved', 'canceled'], default: 'draft' }, // Status of the event
  recurring: { type: Boolean, default: false }, // Indicates if the event is recurring
  recurrence: { type: String, enum: ['daily', 'weekly', 'monthly'], required: function() { return this.recurring; } }, // Recurrence pattern
}, { timestamps: true });

// Method to validate user roles
baseEventSchema.methods.validateUserRole = function(user) {
  if (user.role !== 'admin' && user.role !== 'organisateur') {
    throw new Error('Not authorized to create an event');
  }
};

// Pre-save middleware for date and time validation
baseEventSchema.pre('save', function(next) {
  if (this.end_time <= this.start_time) {
    throw new Error('End time must be after start time');
  }
  if (this.date < new Date()) {
    throw new Error('Event date must be in the future');
  }
  next();
});

export default mongoose.model('Event', baseEventSchema);
