import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Button, Typography, RadioGroup, FormControlLabel, Radio, TextField, Stepper, Step, StepLabel, CircularProgress, Grid, Divider
} from '@mui/material';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import dayjs from 'dayjs';
import PaymentPage from './PaymentPage';

const OrderPage = () => {
    const { id } = useParams(); // Order ID from the URL
    const { user } = useAuth();  // Get user details from context
    const { showNotification } = useNotifications();

    const [event, setEvent] = useState(null);
    const [order, setOrder] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deliveryMethod, setDeliveryMethod] = useState('email');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('creditCard');
    const [paymentModalOpen, setPaymentModalOpen] = useState(false); // Manage modal state
    const [userDetails, setUserDetails] = useState({
        sex: '',
        lastName: '',
        firstName: '',
        address: '',
        postalCode: '',
        city: '',
        country: '',
        birthDate: '',
        phoneNumber: '',
        email: '',
    });

    // Fetch basic user info from the user collection
    useEffect(() => {
        if (user) {
            setUserDetails(prevDetails => ({
                ...prevDetails,
                lastName: user.nom || '',
                firstName: user.prenom || '',
                phoneNumber: user.telephone || '',
                email: user.email || '',
            }));
        }
    }, [user]);

    // Fetch existing purchase info if available
    useEffect(() => {
        const fetchUserPurchaseInfo = async () => {
            try {
                if (user) {
                    console.log("Fetching user purchase info..."); // Debugging line
                    const response = await api.get(`/orders/user-purchase-info/${user._id}`);
                    console.log("User purchase info response:", response.data); // Debugging line
                    if (response.status === 200 && response.data) {
                        setUserDetails(prevDetails => ({
                            ...prevDetails,
                            sex: response.data.sex || prevDetails.sex,
                            lastName: response.data.lastName || prevDetails.lastName,
                            firstName: response.data.firstName || prevDetails.firstName,
                            address: response.data.address || prevDetails.address,
                            postalCode: response.data.postalCode || prevDetails.postalCode,
                            city: response.data.city || prevDetails.city,
                            country: response.data.country || prevDetails.country,
                            birthDate: response.data.birthDate || prevDetails.birthDate,
                            phoneNumber: response.data.phoneNumber || prevDetails.phoneNumber,
                            email: response.data.email || prevDetails.email,
                        }));
                    }
                }
            } catch (error) {
                console.error("Error fetching user purchase info:", error.message);
            }
        };
    
        fetchUserPurchaseInfo();
    }, [user]);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                if (!id) return;
                setLoading(true);

                const response = await api.get(`/orders/${id}`);
                if (response.status === 200) {
                    setOrder(response.data);

                    const eventResponse = await api.get(`/event/${response.data.event}`);
                    setEvent(eventResponse.data);

                    const ticketsResponse = await api.get(`/tickets/${response.data.event}`);
                    setTickets(ticketsResponse.data);
                } else {
                    throw new Error(`Order not found with id ${id}`);
                }
            } catch (error) {
                console.error("Error fetching order or event details:", error.message);
                setError(error.message);
                showNotification('Error fetching order or event details', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handlePurchase = async () => {
        try {
            if (!order || !event) {
                showNotification('Order or event information is missing.', 'error');
                return;
            }
    
            // Ensure that the tickets data matches the backend's expected format
            const ticketsData = order.tickets.map(t => ({
                ticketId: t.ticket._id,  // The ID of the ticket
                quantity: t.quantity,    // The selected quantity
            }));
    
            console.log('Constructed tickets data:', JSON.stringify(ticketsData, null, 2));
    
            const response = await api.post('/orders/purchase', {
                userId: user ? user._id : null,
                tickets: ticketsData,
                totalAmount: order.totalAmount,
                userDetails,
                deliveryMethod,
                eventId: event._id // Include the eventId in the request
            });
    
            if (response.status === 200) {
                showNotification('Purchase successful!', 'success');
                setPaymentModalOpen(true);  // Open the payment modal on success
            } else {
                showNotification('Purchase failed!', 'error');
            }
        } catch (error) {
            console.error('Error purchasing tickets:', error.message);
            showNotification('Error purchasing tickets', 'error');
        }
    };

    const closePaymentModal = () => {
        setPaymentModalOpen(false);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography variant="h6">{error}</Typography>;

    if (!event || !order || tickets.length === 0) {
        return <Typography variant="h6">Error loading order details...</Typography>;
    }

    const ticketSummary = order.tickets.map(t => {
        const ticketInfo = tickets.find(ticket => ticket._id === t.ticket._id);
        return `${t.quantity} x ${ticketInfo.category} (${ticketInfo.price}€ each)`;
    }).join(', ');

    return (
        <Box sx={{ padding: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {['Delivery', 'Payment', 'Order Review'].map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box mt={4}>
                {activeStep === 0 && (
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h4" gutterBottom>Delivery Method</Typography>
                            <RadioGroup
                                value={deliveryMethod}
                                onChange={(e) => setDeliveryMethod(e.target.value)}
                            >
                                <FormControlLabel value="email" control={<Radio />} label="e-Ticket" />
                                <FormControlLabel value="physical" control={<Radio />} label="Store Pickup or Delivery" />
                            </RadioGroup>

                            <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>Your Information</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Sex"
                                        select
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        SelectProps={{
                                            native: true,
                                        }}
                                        value={userDetails.sex}
                                        onChange={(e) => setUserDetails({ ...userDetails, sex: e.target.value })}
                                    >
                                        <option value=""></option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="First Name"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        value={userDetails.firstName}
                                        onChange={(e) => setUserDetails({ ...userDetails, firstName: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Last Name"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        value={userDetails.lastName}
                                        onChange={(e) => setUserDetails({ ...userDetails, lastName: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Address"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        value={userDetails.address}
                                        onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Postal Code"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        value={userDetails.postalCode}
                                        onChange={(e) => setUserDetails({ ...userDetails, postalCode: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="City"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        value={userDetails.city}
                                        onChange={(e) => setUserDetails({ ...userDetails, city: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Country"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        value={userDetails.country}
                                        onChange={(e) => setUserDetails({ ...userDetails, country: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Date of Birth"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        type='date'
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={userDetails.birthDate}
                                        onChange={(e) => setUserDetails({ ...userDetails, birthDate: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Phone Number"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        value={userDetails.phoneNumber}
                                        onChange={(e) => setUserDetails({ ...userDetails, phoneNumber: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Email"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        value={userDetails.email}
                                        onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                                    />
                                </Grid>
                            </Grid>

                            <Button variant="contained" color="primary" onClick={handleNext} sx={{ mt: 3 }}>Next</Button>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            {/* Order Summary on the right side */}
                            <Box sx={{ border: '1px solid #ddd', padding: 2 }}>
                                <Typography variant="h6">Order Summary</Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="body1">
                                    Event: {event.name}
                                </Typography>
                                <Typography variant="body1">
                                    Date: {new Date(event.date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body1">
                                    Tickets: {ticketSummary}
                                </Typography>
                                <Typography variant="body1">
                                    Total: {order.totalAmount} €
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                )}

                {activeStep === 1 && (
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h4" gutterBottom>Payment Method</Typography>
                            <RadioGroup
                                value={selectedPaymentMethod}
                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            >
                                <FormControlLabel value="creditCard" control={<Radio />} label="Credit Card" />
                            </RadioGroup>

                            <Button variant="contained" color="primary" onClick={handleNext} sx={{ mt: 3 }}>Next</Button>
                            <Button variant="text" onClick={handleBack} sx={{ mt: 3 }}>Back</Button>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            {/* Order Summary on the right side */}
                            <Box sx={{ border: '1px solid #ddd', padding: 2 }}>
                                <Typography variant="h6">Order Summary</Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="body1">
                                    Event: {event.name}
                                </Typography>
                                <Typography variant="body1">
                                    Date: {new Date(event.date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body1">
                                    Tickets: {ticketSummary}
                                </Typography>
                                <Typography variant="body1">
                                    Total: {order.totalAmount} €
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                )}

                {activeStep === 2 && (
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h4" gutterBottom>Order Review</Typography>
                            <Box>
                                <Typography variant="h6" gutterBottom>Your Address</Typography>
                                <Typography variant="body1"> {userDetails.firstName} {userDetails.lastName}</Typography>
                                <Typography variant="body1">{userDetails.address}</Typography>
                                <Typography variant="body1">{userDetails.postalCode} {userDetails.city}</Typography>
                                <Typography variant="body1">{userDetails.country}</Typography>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="h6" gutterBottom>Contact Details</Typography>
                                <Typography variant="body1">Email: {userDetails.email}</Typography>
                                <Typography variant="body1">Phone: {userDetails.phoneNumber}</Typography>
                                <Typography variant="body1">Date of Birth: {dayjs(userDetails.birthDate).format('DD/MM/YYYY')}</Typography>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="h6" gutterBottom>Delivery Method</Typography>
                                <Typography variant="body1">{deliveryMethod === 'email' ? 'e-Ticket' : 'Store Pickup or Delivery'}</Typography>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="h6" gutterBottom>Payment Method</Typography>
                                <Typography variant="body1">Credit Card</Typography>
                                <Typography variant="body1">Le paiement s'effectue après cette étape. Selon le mode de paiement sélectionné, vous pourrez être dirigé vers votre prestataire de paiement.</Typography>
                            </Box>

                            <Button variant="contained" color="primary" onClick={handlePurchase} sx={{ mt: 3 }}>Confirm Purchase</Button>
                            <Button variant="text" onClick={handleBack} sx={{ mt: 3 }}>Back</Button>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            {/* Order Summary on the right side */}
                            <Box sx={{ border: '1px solid #ddd', padding: 2 }}>
                                <Typography variant="h6">Order Summary</Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="body1">
                                    Event: {event.name}
                                </Typography>
                                <Typography variant="body1">
                                    Date: {new Date(event.date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body1">
                                    Tickets: {ticketSummary}
                                </Typography>
                                <Typography variant="body1">
                                    Total: {order.totalAmount} €
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </Box>

            <PaymentPage
                open={paymentModalOpen}
                handleClose={closePaymentModal}
                orderId={order._id}
                totalAmount={order.totalAmount}
            />
        </Box>
    );
};

export default OrderPage;
