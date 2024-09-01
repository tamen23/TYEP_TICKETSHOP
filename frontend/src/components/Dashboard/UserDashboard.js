import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Button, Card, CardContent, CardActions } from '@mui/material';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get(`/orders/user/${user._id}/orders`);
        const sortedOrders = response.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        showNotification('Error fetching orders', 'error');
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const downloadTicket = async (ticketId) => {
    try {
      const response = await api.get(`/orders/tickets/download/${ticketId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket_${ticketId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading ticket:', error);
      showNotification('Error downloading ticket', 'error');
    }
  };

  const renderOrders = (status) => {
    return orders
      .filter(order => order.status === status)
      .map(order => (
        <Grid item xs={12} sm={6} md={4} key={order._id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{order.event.name}</Typography>
              <Typography>Date: {new Date(order.event.date).toLocaleDateString()}</Typography>
              <Typography>Status: {order.status}</Typography>
              <Typography>Total: {order.totalAmount}€</Typography>
            </CardContent>
            <CardActions>
              {order.generatedTickets.map(ticket => (
                <Button key={ticket.ticketId} onClick={() => downloadTicket(ticket.ticketId)}>Download Ticket</Button>
              ))}
            </CardActions>
          </Card>
        </Grid>
      ));
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom style={{ fontWeight: 'bold', fontSize: '32px', marginTop: '5cm' }}>
        Welcome, {user?.nom}!
      </Typography>
      <Typography variant="body1" gutterBottom style={{ marginBottom: '24px' }}>
        Here you can find the list of your orders and download the tickets.
      </Typography>

      <Typography variant="h5" gutterBottom style={{ marginTop: '24px', fontWeight: 'bold' }}>
        Completed Orders
      </Typography>
      <Grid container spacing={2}>
        {renderOrders('completed')}
      </Grid>

      <Typography variant="h5" gutterBottom style={{ marginTop: '24px', fontWeight: 'bold' }}>
        Pending Orders
      </Typography>
      <Grid container spacing={2}>
        {renderOrders('pending')}
      </Grid>

      <Typography variant="h5" gutterBottom style={{ marginTop: '24px', fontWeight: 'bold' }}>
        Canceled Orders
      </Typography>
      <Grid container spacing={2}>
        {renderOrders('canceled')}
      </Grid>
    </Container>
  );
};

export default UserDashboard;
