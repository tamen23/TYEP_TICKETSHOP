import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Button, Grid, Box } from '@mui/material';
import Footer from '../Footer/Footer';

const EventCards = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/event/approved');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching approved events:', error);
      }
    };

    fetchEvents();
  }, []);

  const getSmallestPrice = (seatCategories) => {
    const prices = seatCategories.map(category => category.price).filter(price => price > 0);
    return prices.length ? Math.min(...prices) : 'Free';
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box flex="1">
        <Grid container spacing={3}>
          {events.map(event => (
            <Grid item key={event._id} xs={12} sm={6} md={4}>
              <Card>
                <CardActionArea component={Link} to={`/event/${event._id}`}>
                  <CardMedia
                    component="img"
                    alt={event.name}
                    height="140"
                    image={`http://localhost:8000/${event.images[0]}`}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {event.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getSmallestPrice(event.seat_categories)} €
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <Button component={Link} to={`/event/${event._id}`} size="small" color="primary">
                  View Event
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
};

export default EventCards;
