import express from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv'



const app = express();
dotenv.config();



const connectDB = async () => { 
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
    }
}

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection is disconnected");
});




app.listen(8000, () => { 
    connectDB();
    console.log('Connected and Server is running on port 8000.');
    }); 