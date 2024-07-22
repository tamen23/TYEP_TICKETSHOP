// models/capturmail.js
import mongoose from 'mongoose';

const capturmailSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now }
}, { collection: 'capturmail' });

const capturmail = mongoose.model('capturmail', capturmailSchema);



export default  capturmail;