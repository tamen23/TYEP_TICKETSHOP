import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 60000, // 30 seconds timeout
      socketTimeoutMS: 60000, // 45 seconds timeout
      
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection is disconnected. Attempting to reconnect...');
  connectDB();
});

export default connectDB;


///admmin new password NewPassword123