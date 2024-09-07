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
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import api from '../../api';
import { useNotifications } from '../../context/NotificationsContext';

const PaymentPage = ({ open, handleClose, orderId, totalAmount, userDetails = {} }) => {
    const stripe = useStripe();  // Stripe instance for handling payment
    const elements = useElements();  // Stripe Elements instance for accessing the CardElement
    const { showNotification } = useNotifications();  // Notification context for user feedback
    const [loading, setLoading] = useState(false);  // State to manage loading status
    const [saveCard, setSaveCard] = useState(false);  // State to manage save card option
    const [showEmailModal, setShowEmailModal] = useState(false); // State for controlling the email modal
    const navigate = useNavigate();  // Initialize useNavigate for redirection

    // Mapping of country names to their ISO 3166-1 alpha-2 codes
    const countryCodes = {
        'france': 'FR',
        'France': 'FR',
        'france ': 'FR',
        'united states': 'US',
        'united kingdom': 'GB',
        'germany': 'DE',
        'canada': 'CA',
        // Add more countries as needed
    };

    // Function to handle the payment submission
    const handlePaymentSubmit = async () => {
        setLoading(true);  // Set loading state to true while processing payment
        try {
            const cardElement = elements.getElement(CardElement);

            // Get the country code from the full country name, trimming any extra spaces
            const country = countryCodes[userDetails.country.trim().toLowerCase()] || userDetails.country.trim();

            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    name: `${userDetails.firstName || ''} ${userDetails.lastName || ''}`,
                    email: userDetails.email || '',
                    address: {
                        line1: userDetails.address || '',
                        postal_code: userDetails.postalCode || '',
                        city: userDetails.city || '',
                        country: country,  // Use the ISO 3166-1 alpha-2 country code
                    },
                },
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
                userDetails,  // Include userDetails in the request if needed
            });

            if (response.data.success) {
                // Show success notification and close the payment dialog
                showNotification('Payment successful', 'success');
                setShowEmailModal(true);  // Open the email modal on success
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

    const handleSendEmail = async () => {
        try {
            await api.post(`/orders/${orderId}/send-email`);
            showNotification('Ticket sent to your email', 'success');
            setShowEmailModal(false);
            handleClose();
            navigate('/user-dashboard');
        } catch (error) {
            console.error('Error sending email:', error);
            showNotification('Error sending email', 'error');
        }
    };

    return (
        <>
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
                            defaultValue={`${userDetails.firstName || ''} ${userDetails.lastName || ''}`}
                        />
                    </Box>

                    <Box mt={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <CardElement
                                    options={{ style: { base: { fontSize: '16px' } } }}
                                    disabled={loading}
                                />
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
                                    disabled={loading}
                                />
                            }
                            label="Enregistrer pour mes futurs paiements"
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="secondary" disabled={loading}>
                        Fermer
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePaymentSubmit}
                        disabled={loading}
                        sx={{ width: '100%' }}
                    >
                        {loading ? 'Processing...' : `Payer € ${totalAmount}`}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showEmailModal} onClose={() => setShowEmailModal(false)}>
                <DialogContent>
                    <Typography>
                        Your ticket has been generated. Click OK to send it to your email.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSendEmail} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PaymentPage;
