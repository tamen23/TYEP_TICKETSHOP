import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/auth.js';
import connectDB from './config/db.js';
import sgMail from './config/sendgrid.js';
import cors from 'cors';
import ticketRoute from './routes/Evenement.js';
import contactRoutes from './routes/contact.js';
import eventRoute from './routes/event.js';
import adminRoutes from './routes/adminRoutes.js';  // Adjust the path as necessary
import ticketRoutes from './routes/ticketRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import emailRoute from './routes/email.js';



const app = express();
dotenv.config();


//connect to database 
connectDB();


// Enable CORS
app.use(cors());


//middleware
app.use(express.json());

// Email route
app.use('/api/email', emailRoute);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
  });

//Authentification route
app.use("/api/auth", authRoute);

//get all Evenements route
app.use('/api/ticket', ticketRoute);

//get all events route
app.use('/api/event', eventRoute);

//get all Orders route
app.use('/api/orders', orderRoutes);

//get all Tickets route billets 
app.use('/api/tickets', ticketRoutes);

//admin routes
app.use('/api/admin', adminRoutes);

// Serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

app.use('/api/email', contactRoutes);


///port usage
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});