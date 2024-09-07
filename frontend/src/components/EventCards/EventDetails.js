import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Grid, Card, TextField } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Login from '../Auth/Login'; // Import the Login component
import ModalAuth from '../Shared/ModalAuth'; // Import the modal component
import Footer from '../../components/Footer/Footer';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [totalAmount, setTotalAmount] = useState(null);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // State to control the login modal

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/event/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEvent();
  }, [id]);

  // Fetch available tickets for the event
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get(`/tickets/${id}`);
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, [id]);

  // Handle quantity change for each ticket
  const handleQuantityChange = (ticketId, category, price, maxCount, count) => {
    const sanitizedCount = isNaN(count) || count < 0 ? 0 : count; // Handle empty input or invalid numbers
    const newSelectedTickets = { ...selectedTickets };

    if (sanitizedCount > 0) {
      newSelectedTickets[ticketId] = {
        _id: ticketId,
        category,
        price,
        count: Math.min(maxCount, sanitizedCount), // Ensure count is within valid range
        maxCount,
      };
    } else {
      delete newSelectedTickets[ticketId]; // Remove the ticket entry if count is zero or empty
    }

    setSelectedTickets(newSelectedTickets);

    // Calculate total amount
    const newTotalAmount = Object.values(newSelectedTickets).reduce(
      (acc, ticket) => acc + ticket.price * ticket.count,
      0
    );
    setTotalAmount(newTotalAmount === 0 ? null : newTotalAmount);
  };

  // Handle purchase submission
  const handlePurchase = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (Object.keys(selectedTickets).length === 0) {
      alert('Please select at least one ticket.');
      return;
    }

    try {
      const orderData = {
        tickets: Object.values(selectedTickets).map(ticket => ({
          ticketId: ticket._id,
          quantity: ticket.count
        })),
        totalAmount,
        eventId: id,
        userId: user._id,
        email: user.email
      };

      // Send the request to create an order
      const response = await api.post('/orders/purchase', orderData);
      
      // Redirect to the order page
      navigate(`/order/${response.data.orderId}`);
    } catch (error) {
      console.error('Error purchasing tickets:', error);

      // Enhanced error handling
      if (error.response) {
        alert(`Error: ${error.response.data.error || error.response.status}`);
      } else if (error.request) {
        alert('No response received from the server. Please try again later.');
      } else {
        alert(`Unexpected error: ${error.message}`);
      }
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
   <>
    <Box sx={{ padding: '24px', backgroundColor: '#f5f5f5', fontFamily: 'Poppins, sans-serif', position: 'relative', top: '70px', height: '150vh', overflow: 'hidden', '::before': { content: '""', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1 } }}>
      {/* Content goes here */}
      <Grid container spacing={3} justifyContent="center" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Event Info Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ padding: '16px', backgroundColor: '#fff', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '25px', lineHeight: '21px' }}>
              {event.name}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px', lineHeight: '21px' }}>
              {event.description}
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '14px', lineHeight: '21px' }}>
              <AccessTimeIcon sx={{ marginRight: '8px' }} />
              {new Date(event.date).toLocaleDateString()} - {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', fontSize: '14px', lineHeight: '21px' }}>
              <LocationOnIcon sx={{ marginRight: '8px' }} />
              {event.venue}, {event.street_address}, {event.city}, {event.country}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px', lineHeight: '21px' }}>
            Category and sub category : {event.category} : {event.sub_category} 
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px', lineHeight: '21px' }}>
              Audience : {event.target_audience}
            </Typography>
          </Card>
        </Grid>

        {/* Pricing Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ padding: '16px', backgroundColor: '#fff', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '20px', lineHeight: '21px' }}>
              Pricing
            </Typography>
            <ul style={{ padding: 0, margin: 0, listStyleType: 'none', fontSize: '14px', lineHeight: '21px' }}>
              {event.seat_categories.map((category, index) => (
                <li key={index}>
                  {category.type} - {category.count} seats at {category.price === 0 ? 'Free' : `${category.price} €`}
                </li>
              ))}
            </ul>
          </Card>
        </Grid>

        {/* Purchase Button Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ padding: '16px', backgroundColor: '#fff', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (user) {
                  setShowPurchaseForm(true);
                } else {
                  setShowLoginModal(true);
                }
              }}
              sx={{ 
                width: '155px', 
                height: '45px', 
                backgroundColor: '#110000', 
                color: '#ffffff', 
                fontSize: '14px', 
                lineHeight: '21px', 
                textAlign: 'center', 
                fontFamily: 'Poppins, sans-serif', 
                textTransform: 'none', 
                letterSpacing: 'normal', 
                '&:hover': { backgroundColor: '#000000' } 
              }}
            >
              Purchase Tickets
            </Button>
          </Card>
        </Grid>
      </Grid>

      {/* Purchase Form Section */}
      {showPurchaseForm && (
        <Grid container spacing={3} justifyContent="center" mt={4} sx={{ position: 'relative', zIndex: 2 }}>
          <Grid item xs={12} sm={8} md={6}>
            <Card sx={{ padding: '24px', backgroundColor: '#fff', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <Typography variant="h2" sx={{ textAlign: 'center', marginBottom: '24px' }}>Select Tickets</Typography>
              <ul style={{ padding: 0, listStyleType: 'none' }}>
                {tickets.map((ticket) => (
                  <li key={ticket._id} style={{ marginBottom: '16px' }}>
                    <Typography variant="body1">
                      {ticket.category} - {ticket.price === 0 ? 'Free' : `${ticket.price} €`}
                    </Typography>
                    <TextField
                      type="number"
                      min="0"
                      max={ticket.count - ticket.sold}
                      value={selectedTickets[ticket._id]?.count || ''}
                      onChange={(e) =>
                        handleQuantityChange(
                          ticket._id,
                          ticket.category,
                          ticket.price,
                          ticket.count - ticket.sold,
                          parseInt(e.target.value, 10)
                        )
                      }
                      label={`Available: ${ticket.count - ticket.sold}/${ticket.count}`}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{
                        marginTop: '8px',
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#87CEEB', // Sky blue border on hover
                          },
                        },
                      }}
                    />
                    <Typography variant="body2" sx={{ marginTop: '4px' }}>
                      Price: {ticket.price * (selectedTickets[ticket._id]?.count || 0)} €
                    </Typography>
                  </li>
                ))}
              </ul>
              <Typography variant="h3" sx={{ marginTop: '24px', textAlign: 'center' }}>
                Total: {totalAmount === null ? '' : totalAmount === 0 ? 'Free' : `${totalAmount} €`}
              </Typography>
              {Object.keys(selectedTickets).length > 0 && (
                <Box mt={4}>
                  <Typography variant="h4" sx={{ marginBottom: '16px' }}>Order Summary</Typography>
                  <Typography variant="body2">
                    For the event {event.name}, you are ordering:
                  </Typography>
                  <ul>
                    {Object.entries(selectedTickets).map(([key, ticket]) => (
                      <li key={key}>
                        {ticket.count} x {ticket.price}€ {ticket.category} ticket
                      </li>
                    ))}
                  </ul>
                  <Typography variant="body2" sx={{ color: 'red', marginTop: '16px' }}>
                    Check your order because it will be impossible to modify it after you confirm the purchase.
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePurchase}
                  sx={{ 
                    width: '200px', 
                    height: '50px', 
                    backgroundColor: '#110000', 
                    color: '#ffffff', 
                    fontSize: '16px', 
                    textTransform: 'none', 
                    '&:hover': { backgroundColor: '#000000' }
                  }}
                >
                  Confirm Purchase
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      {showLoginModal && (
        <ModalAuth show={showLoginModal} onClose={() => setShowLoginModal(false)}>
          <Login onClose={() => setShowLoginModal(false)} />
        </ModalAuth>
      )}
    </Box>
    <Footer/>
   </>
  );
};

export default EventDetails;
