import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, MenuItem, Select, Snackbar, Alert, Modal } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useNotifications } from '../../context/NotificationsContext';
import api from '../../api';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const { showNotification } = useNotifications();
    const [openModal, setOpenModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/event');
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
                setEvents([]);
            }
        };

        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/event/${id}`);
            setEvents(events.filter(event => event._id !== id));
            showNotification('Event deleted successfully', 'success', 1000);
        } catch (error) {
            console.error('Error deleting event:', error);
            showNotification('Error deleting event', 'error', 1000);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/event/${id}/status`, { status });
            setEvents(events.map(event => event._id === id ? { ...event, status } : event));
            showNotification('Event status updated successfully', 'success', 1000);
        } catch (error) {
            console.error('Error updating event status:', error);
            showNotification('Error updating event status', 'error', 1000);
        }
    };

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const itemsPerPage = 15;
    const paginatedEvents = events.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedImage('');
    };

    return (
        <Box>
            <TableContainer component={Paper} className="table-container">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>Organizer Name</TableCell>
                            <TableCell>Organizer Structure</TableCell>
                            <TableCell>Event Name</TableCell>
                            <TableCell>Venue</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Target Audience</TableCell>
                            <TableCell>Date</TableCell>
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
                        {paginatedEvents.length > 0 ? paginatedEvents.map((event, index) => (
                            <TableRow key={event._id}>
                                <TableCell>{(page - 1) * itemsPerPage + index + 1}</TableCell>
                                <TableCell>{event.organizer_id.nom} {event.organizer_id.prenom}</TableCell>
                                <TableCell>{event.organizer_id.nomDeStructure}</TableCell>
                                <TableCell>{event.name}</TableCell>
                                <TableCell>{event.venue}</TableCell>
                                <TableCell>{event.street_address}, {event.city}, {event.country}</TableCell>
                                <TableCell>{event.category}</TableCell>
                                <TableCell>{event.target_audience.join(', ')}</TableCell>
                                <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                                <TableCell>{event.start_time} - {event.end_time}</TableCell>
                                <TableCell>{event.pricing}</TableCell>
                                <TableCell>{event.capacity}</TableCell>
                                <TableCell>
                                    {event.seat_categories.map((seat, idx) => (
                                        <div key={idx}>{seat.type}: {seat.count} seats @ ${seat.price}</div>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    {event.images.map((image, idx) => (
                                        <img
                                            key={idx}
                                            src={`http://localhost:8000/${image}`}
                                            alt="Event"
                                            style={{ width: '50px', cursor: 'pointer' }}
                                            onClick={() => handleImageClick(`http://localhost:8000/${image}`)}
                                        />
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={event.status}
                                        onChange={(e) => handleStatusChange(event._id, e.target.value)}
                                    >
                                        <MenuItem value="draft">Draft</MenuItem>
                                        <MenuItem value="approved">Approved</MenuItem>
                                        <MenuItem value="canceled">Canceled</MenuItem>
                                    </Select>
                                </TableCell>
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
            <Stack spacing={2} alignItems="center" mt={2}>
                <Pagination
                    count={Math.ceil(events.length / itemsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    variant="outlined"
                    color="primary"
                />
            </Stack>
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', width: '80%',
                    bgcolor: 'background.paper', boxShadow: 24, p: 4
                }}>
                    <img src={selectedImage} alt="Selected Event" style={{ width: '100%' }} />
                </Box>
            </Modal>
        </Box>
    );
};

export default EventList;
