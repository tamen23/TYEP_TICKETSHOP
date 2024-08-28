import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, CardActions, Typography, Grid, Box, Paper, MenuList, MenuItem, ListItemText } from '@mui/material';
import Footer from '../../components/Footer/Footer';
import api from '../../api';

const EventShowCard = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedMonth, setSelectedMonth] = useState('all'); // Initially show all data
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  // Function to get the name of a month relative to the current month
  const getMonthName = (offset) => {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    return date.toLocaleString('default', { month: 'long' });
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(' ');
    return words.length > wordLimit ? `${words.slice(0, wordLimit).join(' ')}...` : text;
  };

  const filterEventsByMonth = (event) => {
    if (selectedMonth === 'all') {
      return true; // If "all" is selected, return all events
    }

    const eventDate = new Date(event.date);
    const today = new Date();
    let selectedDate = new Date();

    if (selectedMonth === 'last') {
      selectedDate.setMonth(today.getMonth() - 1);
    } else if (selectedMonth === 'next') {
      selectedDate.setMonth(today.getMonth() + 1);
    } else if (selectedMonth === 'afterNext') {
      selectedDate.setMonth(today.getMonth() + 2);
    }

    return eventDate.getMonth() === selectedDate.getMonth() && eventDate.getFullYear() === selectedDate.getFullYear();
  };

  const filterEventsByCategory = (event) => {
    return selectedCategory ? event.category === selectedCategory : true;
  };

  const getFullImageUrl = (imagePath) => {
    return imagePath.startsWith('http://') || imagePath.startsWith('https://')
      ? imagePath
      : `http://localhost:8000/${imagePath}`;
  };

  const renderEvents = () => {
    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      const today = new Date();
      const isCorrectTab =
        activeTab === 'upcoming' ? eventDate >= today : eventDate < today;
      const isCorrectMonth = filterEventsByMonth(event);
      const isCorrectCategory = filterEventsByCategory(event);
      return isCorrectTab && isCorrectMonth && isCorrectCategory;
    });

    return (
      <Grid container spacing={2}>
        {filteredEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={event._id}>
            <Card
              sx={{
                maxWidth: 345,
                backgroundColor: '#fff',
                color: '#000',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={getFullImageUrl(event.images[0])}
                alt={event.name}
                sx={{ borderRadius: '8px 8px 0 0' }}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '18px' }}>
                  {event.name.length > 10 ? `${event.name.substring(0, 10)}...` : event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '8px' }}>
                  {truncateText(event.description, 13)}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
                <Typography variant="body2" sx={{ color: '#888', fontWeight: 'bold' }}>
                  {new Date(event.date).toLocaleDateString()}
                </Typography>
                <Typography component={Link} to={`/event/${event._id}`} sx={{ color: '#03a9f4', textTransform: 'none', fontWeight: 'bold', textDecoration: 'none' }}>
                  Learn More
                </Typography>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <>
      <div>
      
        <div className="content-container">
          <div className="filter-section">
            <div className="filter-card">
              <div>
                <div className="filter-title">Sort by Month</div>
                <Paper sx={{ width: 320, maxWidth: '100%' }}>
                  <MenuList>
                    <MenuItem onClick={() => setSelectedMonth('all')}>
                      <ListItemText primary="All" /> {/* All events */}
                    </MenuItem>
                    <MenuItem onClick={() => setSelectedMonth('current')}>
                      <ListItemText primary={getMonthName(0)} /> {/* Current month */}
                    </MenuItem>
                    <MenuItem onClick={() => setSelectedMonth('last')}>
                      <ListItemText primary={getMonthName(-1)} /> {/* Last month */}
                    </MenuItem>
                    <MenuItem onClick={() => setSelectedMonth('next')}>
                      <ListItemText primary={getMonthName(1)} /> {/* Next month */}
                    </MenuItem>
                    <MenuItem onClick={() => setSelectedMonth('afterNext')}>
                      <ListItemText primary={getMonthName(2)} /> {/* Month after next */}
                    </MenuItem>
                  </MenuList>
                </Paper>
              </div>
            </div>
          </div>

          <div className="events-container">
            <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
              {/* Navigation bar */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
                <div
                  onClick={() => setActiveTab('upcoming')}
                  style={{
                    cursor: 'pointer',
                    padding: '10px 20px',
                    color: activeTab === 'upcoming' ? '#03a9f4' : '#000',
                    borderTop: activeTab === 'upcoming' ? '3px solid #03a9f4' : '3px solid transparent',
                    fontWeight: activeTab === 'upcoming' ? 'bold' : 'normal',
                  }}
                >
                  Upcoming
                </div>
                <div
                  onClick={() => setActiveTab('past')}
                  style={{
                    cursor: 'pointer',
                    padding: '10px 20px',
                    color: activeTab === 'past' ? '#03a9f4' : '#000',
                    borderTop: activeTab === 'past' ? '3px solid #03a9f4' : '3px solid transparent',
                    fontWeight: activeTab === 'past' ? 'bold' : 'normal',
                  }}
                >
                  Past
                </div>
              </div>
              {renderEvents()}
            </Box>
          </div>
        </div>
      </div>


      <style jsx>{`
        .content-container {
          display: flex;
          gap: 20px;
          padding: 20px;
          height:100vh
        }

        .filter-section {
          flex: 1;
          max-width: 300px;
        }

        .filter-card {
          background-color: #fff;
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 8px;
        }

        .filter-title {
          font-size: 16px; /* Reduce text size */
          font-weight: bold;
          margin-bottom: 10px;
        }

        .events-container {
          flex: 5;
          background-color: #F9F9F9;
        }

        .page-heading-shows-events {
          background-image: url('https://les-seminaires.eu/wp-content/uploads/2019/04/organisation-evenement-grand-public.jpg');
          background-size: cover;
          background-repeat: no-repeat;
          padding: 80px 0;
          text-align: center;
        }

        .page-heading-shows-events h2 {
          font-size: 50px;
          color: #fff;
          font-weight: 800;
          margin-bottom: 15px;
        }

        .page-heading-shows-events span {
          font-size: 20px;
          color: #fff;
          font-weight: 300;
          padding: 0 250px;
          display: inline-block;
        }
      `}</style>
    </>
  );
};

export default EventShowCard;
