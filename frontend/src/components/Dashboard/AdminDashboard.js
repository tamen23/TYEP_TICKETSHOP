import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { styled } from '@mui/system';
import api from '../../api';
import AuthContext from '../../context/AuthContext';

// Styles for the container
const DashboardContainer = styled(Container)({
  padding: 24,
  marginTop: 24,
  backgroundColor: '#f5f5f5',
  borderRadius: 8,
  boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
});

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleApprove = async (eventId) => {
    try {
      await api.put(`/events/${eventId}/approve`);
      setEvents(events.filter(event => event._id !== eventId));
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  return (
    <DashboardContainer>
      <Typography variant="h4" gutterBottom>
        Welcome Admin
      </Typography>
      <Typography variant="h6" gutterBottom>
        Events Pending Approval
      </Typography>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{event.name}</Typography>
                <Typography variant="body1">{event.description}</Typography>
                <Typography variant="body2">{event.date}</Typography>
                <Button variant="contained" color="primary" onClick={() => handleApprove(event._id)}>
                  Approve
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </DashboardContainer>
  );
};

export default AdminDashboard;
