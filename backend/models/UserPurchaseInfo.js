import mongoose from 'mongoose';

// Define the schema for storing user purchase information
const userPurchaseInfoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Reference to the User model, optional for guest users
  sex: { type: String, required: true }, // Sex of the user (M. or Mrs.)
  lastName: { type: String, required: true }, // Last name of the user
  firstName: { type: String, required: true }, // First name of the user
  address: { type: String, required: true }, // Address of the user
  postalCode: { type: String, required: true }, // Postal code of the user
  city: { type: String, required: true }, // City of the user
  country: { type: String, required: true }, // Country of the user
  birthDate: { type: Date, required: true }, // Date of birth of the user
  phoneNumber: { type: String, required: true }, // Phone number of the user
  email: { type: String, required: true }, // Email of the user
}, {
  timestamps: true, // Automatically create `createdAt` and `updatedAt` fields
});

// Create the UserPurchaseInfo model
const UserPurchaseInfo = mongoose.model('UserPurchaseInfo', userPurchaseInfoSchema);
export default UserPurchaseInfo;
