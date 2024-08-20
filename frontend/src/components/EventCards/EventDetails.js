import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import './EventDetails.scss';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [totalAmount, setTotalAmount] = useState(null);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);

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
        console.log('Fetched tickets:', response.data); // Debugging log
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

    // Debugging logs
    console.log('Selected tickets:', newSelectedTickets);
    console.log('Total amount:', newTotalAmount);
  };

  // Handle purchase submission
  const handlePurchase = async () => {
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
        userId: user ? user._id : null,
        email: user ? user.email : null
      };

      // Send the request to create an order
      const response = await api.post('/orders/purchase', orderData);
      
      // Log the response for debugging
      console.log('Order created with ID:', response.data.orderId);

      // Redirect to the order page (where user/guest will enter additional information)
      navigate(`/order/${response.data.orderId}`);
    } catch (error) {
      console.error('Error purchasing tickets:', error);

      // Enhanced error handling
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        alert(`Error: ${error.response.data.error || error.response.status}`);
      } else if (error.request) {
        console.error('Request data:', error.request);
        alert('No response received from the server. Please try again later.');
      } else {
        console.error('Error message:', error.message);
        alert(`Unexpected error: ${error.message}`);
      }
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <Box className="event-details">
      <Typography variant="h1">{event.name}</Typography>
      <img
        src={`http://localhost:8000/${event.images[0]}`}
        alt={event.name}
        style={{ width: '100%', maxHeight: '500px' }}
      />
      <Typography variant="body1">{event.description}</Typography>
      <Typography variant="body2">
        Date: {new Date(event.date).toLocaleDateString()}
      </Typography>
      <Typography variant="body2">
        Location: {event.venue}, {event.street_address}, {event.city}, {event.country}
      </Typography>
      <Typography variant="h3">Pricing</Typography>
      <ul>
        {event.seat_categories.map((category, index) => (
          <li key={index}>
            {category.type} - {category.count} seats at{' '}
            {category.price === 0 ? 'Free' : `${category.price} €`}
          </li>
        ))}
      </ul>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowPurchaseForm(true)}
      >
        Buy Tickets
      </Button>

      {showPurchaseForm && (
        <Box className="purchase-form" mt={4}>
          <Typography variant="h2">Select Tickets</Typography>
          <ul>
            {tickets.map((ticket) => (
              <li key={ticket._id}>
                <Typography variant="body1">
                  {ticket.category} -{' '}
                  {ticket.price === 0 ? 'Free' : `${ticket.price} €`}
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
                  margin="normal"
                />
                <Typography variant="body2">
                  Price: {ticket.price * (selectedTickets[ticket._id]?.count || 0)} €
                </Typography>
              </li>
            ))}
          </ul>
          <Typography variant="h3">
            Total: {totalAmount === null ? '' : totalAmount === 0 ? 'Free' : `${totalAmount} €`}
          </Typography>
          {Object.keys(selectedTickets).length > 0 && (
            <Box mt={4}>
              <Typography variant="h4">Order Summary</Typography>
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
              <Typography variant="body2" style={{ color: 'red' }}>
                Check your order because it will be impossible to modify it after you confirm the purchase.
              </Typography>
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handlePurchase}
          >
            Confirm Purchase
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default EventDetails;
