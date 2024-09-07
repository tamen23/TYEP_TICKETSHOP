import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, CardActions, Typography, Grid, Box, Paper, MenuList, MenuItem, ListItemText } from '@mui/material';
import Footer from '../../components/Footer/Footer';
import api from '../../api';

const EventCard = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedMonth, setSelectedMonth] = useState('all');
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

  const getSmallestPrice = (seatCategories) => {
    const prices = seatCategories.map(category => category.price).filter(price => price > 0);
    return prices.length ? Math.min(...prices) : 'Free';
  };

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
    if (selectedMonth === 'all') return true;

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
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '8px' }}>
                  {getSmallestPrice(event.seat_categories)} €
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
        <div className="page-heading-shows-events">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <h2>Our Shows & Events</h2>
                <span>Check out upcoming and past shows & events.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="content-container">
          <div className="filter-section">
            <div className="filter-card">
              <div>
                <div className="filter-title">Sort by Month</div>
                <Paper sx={{ width: 320, maxWidth: '100%' }}>
                  <MenuList>
                    <MenuItem onClick={() => setSelectedMonth('all')}>
                      <ListItemText primary="All" />
                    </MenuItem>
                    <MenuItem onClick={() => setSelectedMonth('current')}>
                      <ListItemText primary={getMonthName(0)} />
                    </MenuItem>
                    <MenuItem onClick={() => setSelectedMonth('last')}>
                      <ListItemText primary={getMonthName(-1)} />
                    </MenuItem>
                    <MenuItem onClick={() => setSelectedMonth('next')}>
                      <ListItemText primary={getMonthName(1)} />
                    </MenuItem>
                    <MenuItem onClick={() => setSelectedMonth('afterNext')}>
                      <ListItemText primary={getMonthName(2)} />
                    </MenuItem>
                  </MenuList>
                </Paper>
              </div>
            </div>
          </div>

          <div className="events-container">
            <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
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
      <Footer />

      <style jsx>{`
        .content-container {
          display: flex;
          gap: 20px;
          padding: 20px;
          height: calc(100vh - 60px); /* Ensure content fits within viewport height minus header */
          overflow: hidden;
        }

        .filter-section {
          flex: 1;
          max-width: 300px;
          overflow-y: auto;
          height: 100%;
        }

        .filter-card {
          background-color: #fff;
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 8px;
        }

        .filter-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .events-container {
          flex: 5;
          background-color: #f9f9f9;
          max-height: 100%;
          padding-bottom: 20px;
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

        @media (max-width: 768px) {
          .content-container {
            flex-direction: column;
            padding: 10px;
            height: calc(100vh - 60px);
          }

          .filter-section {
            max-width: 100%;
            margin-bottom: 20px;
          }

          .events-container {
            flex: none;
            max-width: 100%;
            padding: 10px;
          }

          .page-heading-shows-events h2 {
            font-size: 36px;
          }

          .page-heading-shows-events span {
            font-size: 16px;
            padding: 0 20px;
          }

          .page-heading-shows-events {
            padding: 40px 0;
          }
        }
      `}</style>
    </>
  );
};

export default EventCard;
