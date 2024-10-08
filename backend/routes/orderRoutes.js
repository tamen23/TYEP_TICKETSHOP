import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { purchaseTickets, getOrderDetails, processPayment, getUserPurchaseInfo, triggerTicketEmail, getUserOrders, downloadTicket} from '../controllers/orderController.js';

const router = express.Router();

// Route to purchase tickets and create an order
router.post('/purchase', purchaseTickets);

// Route to fetch order details
router.get('/:orderId', getOrderDetails);

// Route to process payment
router.post('/:orderId/process', processPayment);

router.post('/:orderId/send-email', triggerTicketEmail);

// Route to get user purchase information (new route)
router.get('/user-purchase-info/:userId', getUserPurchaseInfo);

// Add a new route to fetch all orders for a user
router.get('/user/:userId/orders', protect, getUserOrders);


// Route to download ticket
router.get('/tickets/download/:ticketId', downloadTicket);



export default router;
