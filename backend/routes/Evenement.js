import express from 'express';
import { getEvenement } from '../controllers/evenement.js';

const router = express.Router();

router.get('/getEvenement', getEvenement);


export default router;
