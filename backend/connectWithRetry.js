import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectWithRetry = () => {
  console.log('MongoDB connection with retry');
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
  });
};

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection is disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection is disconnected due to app termination');
  process.exit(0);
});

export default connectWithRetry;
