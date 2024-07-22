import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/auth.js';
import connectDB from './config/db.js';
import sgMail from './config/sendgrid.js';
import cors from 'cors';
import ticketRoute from './routes/Evenement.js';
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



///port usage
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});