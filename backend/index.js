import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/auth.js';
import connectDB from './config/db.js';


const app = express();
dotenv.config();


//connect to database 
connectDB();

//middleware
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
  });

//Authentification route
app.use("/api/auth", authRoute);



///port usage
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});