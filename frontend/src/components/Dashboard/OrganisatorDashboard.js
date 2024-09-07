import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Box, Grid, Link
} from '@mui/material';
import { styled } from '@mui/system';
import api from '../../api';
import AuthContext from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
// import Footer from '../Footer/Footer';

const DashboardContainer = styled(Container)({
  padding: 24,
  marginTop: 24,
  backgroundColor: '#f5f5f5',
  borderRadius: 8,
  boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
  position: 'relative',
  top: '110px',
});

const OrganisatorDashboard = () => {
  const { user } = useContext(AuthContext);
  const { showNotification } = useNotifications();
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/event/organizer');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/event/${id}`);
      setEvents(events.filter((event) => event._id !== id));
      showNotification('Event deleted successfully', 'success', 1000);
    } catch (error) {
      console.error('Error deleting event:', error);
      showNotification('Error deleting event', 'error', 1000);
    }
  };

  const handleClickOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      <DashboardContainer style={{ position: 'relative', height: '120vh' }}>
        <Typography variant="h4" gutterBottom>
          {`Welcome ${user.nomDeStructure}`}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Your Events
        </Typography>
        <TableContainer component={Paper} style={{ position: 'relative', height: '120vh' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Event Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Venue</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Sub-Category</TableCell>
                <TableCell>Target Audience</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Pricing</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Seat Categories</TableCell>
                <TableCell>Images</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.length > 0 ? events.map((event, index) => (
                <TableRow key={event._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                  <TableCell>{event.venue}</TableCell>
                  <TableCell>{`${event.street_address}, ${event.city}, ${event.country}`}</TableCell>
                  <TableCell>{event.category}</TableCell>
                  <TableCell>{event.sub_category}</TableCell>
                  <TableCell>{event.target_audience.join(', ')}</TableCell>
                  <TableCell>{`${event.start_time} - ${event.end_time}`}</TableCell>
                  <TableCell>{event.pricing}</TableCell>
                  <TableCell>{event.capacity}</TableCell>
                  <TableCell>
                    {event.seat_categories.map((seat, idx) => (
                      <div key={idx}>
                        <strong>{seat.type}:</strong> {seat.count} seats, {seat.price} €
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {event.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={`http://localhost:8000/${image}`}
                        alt={`Event ${idx + 1}`}
                        style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                        onClick={() => handleClickOpen(`http://localhost:8000/${image}`)}
                      />
                    ))}
                  </TableCell>
                  <TableCell>{event.status}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => handleDelete(event._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={16} align="center">No events found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="image-dialog-title"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="image-dialog-title">Event Image</DialogTitle>
          <DialogContent>
            {selectedImage && (
              <img src={selectedImage} alt="Event" style={{ width: '100%' }} />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </DashboardContainer>
      <div className='FooterOrga' >
        <Box>
          <Container maxWidth="lg" sx={{ height: '100%' }}>
            <Grid container alignItems="center" justifyContent="space-between" sx={{ height: '100%' }}>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Link href="/" color="inherit" underline="hover">
                      HOME
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/events" color="inherit" underline="hover">
                      EVENTS
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/concerts" color="inherit" underline="hover">
                      CONCERTS
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/contact" color="inherit" underline="hover">
                      CONTACT
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/organisation" color="inherit" underline="hover">
                      BECOME A PARTNER
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/a-propos" color="inherit" underline="hover">
                      ABOUT
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="body2">
                  Email: <Link href="mailto:ticketshop@gmail.com" color="inherit" underline="hover">ticketshop@gmail.com</Link>
                </Typography>
                <Typography variant="body2">
                  Tel: <Link href="tel:060004545" color="inherit" underline="hover">060004545</Link>
                </Typography>
                <Typography variant="body2">
                  <Link href="https://www.facebook.com" target="_blank" rel="noopener" color="inherit" underline="hover">Facebook</Link> |
                  <Link href="https://www.twitter.com" target="_blank" rel="noopener" color="inherit" underline="hover">Twitter</Link> |
                  <Link href="https://www.instagram.com" target="_blank" rel="noopener" color="inherit" underline="hover">Instagram</Link>
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography variant="body2">&copy; 2024</Typography>
            </Box>
          </Container>
        </Box>
      </div>
    </>
  );
};

export default OrganisatorDashboard;
