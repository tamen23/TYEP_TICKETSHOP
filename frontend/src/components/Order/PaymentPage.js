import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    TextField,
    Grid,
    Box,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../api';
import { useNotifications } from '../../context/NotificationsContext';

const PaymentPage = ({ open, handleClose, orderId, totalAmount }) => {
    const stripe = useStripe();  // Stripe instance for handling payment
    const elements = useElements();  // Stripe Elements instance for accessing the CardElement
    const { showNotification } = useNotifications();  // Notification context for user feedback
    const [loading, setLoading] = useState(false);  // State to manage loading status
    const [saveCard, setSaveCard] = useState(false);  // State to manage save card option

    // Function to handle the payment submission
    const handlePaymentSubmit = async () => {
        setLoading(true);  // Set loading state to true while processing payment
        try {
            // Access the card information entered by the user
            const cardElement = elements.getElement(CardElement);

            // Create a payment method using the card information
            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (error) {
                console.error('Error creating payment method:', error);
                showNotification('Error creating payment method', 'error');
                return;
            }

            if (!paymentMethod) {
                console.error('Payment method not created');
                showNotification('Payment method not created', 'error');
                return;
            }

            // Send the payment method ID and order ID to your server to process the payment
            const response = await api.post(`/orders/${orderId}/process`, {
                paymentMethodId: paymentMethod.id,
                saveCard: saveCard,  // Include the save card option in the request
            });

            if (response.data.success) {
                // Show success notification and close the payment dialog
                showNotification('Payment successful', 'success');
                handleClose();  // Close the modal on success
            } else {
                // Show failure notification
                showNotification('Payment failed', 'error');
            }
        } catch (error) {
            // Show error notification if something went wrong
            console.error('Error processing payment:', error);
            showNotification('Error processing payment', 'error');
        } finally {
            setLoading(false);  // Set loading state to false after processing payment
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogContent>
                <Typography variant="h6" gutterBottom>
                    Paiement sécurisé
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Merci de compléter vos informations de paiement
                </Typography>

                <Box mt={2}>
                    <TextField
                        label="Titulaire de la carte"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        defaultValue="Paternus Tamen"  // Default cardholder name; can be dynamic based on user data
                    />
                </Box>

                <Box mt={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
                        </Grid>
                    </Grid>
                </Box>

                <Box mt={2}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={saveCard}
                                onChange={(e) => setSaveCard(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Enregistrer pour mes futurs paiements"
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Fermer
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePaymentSubmit}
                    disabled={loading}  // Disable the button while processing payment
                    sx={{ width: '100%' }}
                >
                    {loading ? 'Processing...' : `Payer € ${totalAmount}`}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PaymentPage;
