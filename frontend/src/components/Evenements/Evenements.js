import React, { useEffect, useState, useRef, useContext } from 'react';
import './evenements.scss';
import api from '../../api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { ClipLoader } from 'react-spinners'; // Import the loader
import { Card, CardActionArea, CardContent, CardMedia, Typography, Grid, CardActions } from '@mui/material';
import EventShowCard from './EvenementShow';

const Evenements = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 12; // Limit to 12 tickets per page
    const [filters, setFilters] = useState({
        startDate: null,
        endDate: null,
        location: '',
        category: ''
    });
    const [availableLocations, setAvailableLocations] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState('');
    const [email, setEmail] = useState(user ? user.email : '');
    const [emailError, setEmailError] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef(null);
    const buttonRef = useRef(null);

    // State for loading images
    const [loadingImages, setLoadingImages] = useState(true);

    // Fetch tickets from the API
    const fetchTickets = async () => {
        try {
            const response = await api.get('/ticket/getEvenement');
            setTickets(response.data);
            setFilteredTickets(response.data);
            setAvailableLocations([...new Set(response.data.map(ticket => ticket.Ville))]);
            setAvailableCategories([...new Set(response.data.map(ticket => ticket.Catégorie))]);
            setLoadingImages(false); // Set loading state to false once the data is fetched
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    // Initial fetch on component mount
    useEffect(() => {
        fetchTickets();
    }, []);

    // Apply filters whenever the filter state changes
    useEffect(() => {
        applyFilters();
    }, [filters]);

    // Hide calendar when mouse is not over it or the button
    useEffect(() => {
        const handleMouseOver = (event) => {
            if (
                calendarRef.current &&
                !calendarRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setShowCalendar(false);
            }
        };

        document.addEventListener('mouseover', handleMouseOver);
        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    // Apply filtering logic
    const applyFilters = () => {
        let filtered = tickets;

        // Date filtering logic
        if (filters.startDate || filters.endDate) {
            filtered = filtered.filter(ticket => {
                const nextDate = new Date(ticket['Prochaine date']);
                if (filters.startDate && filters.endDate) {
                    return nextDate >= filters.startDate && nextDate <= filters.endDate;
                } else if (filters.startDate) {
                    return nextDate.toDateString() === filters.startDate.toDateString();
                } else if (filters.endDate) {
                    return nextDate <= filters.endDate;
                }
                return true;
            });
        }

        // Location filtering logic
        if (filters.location) {
            filtered = filtered.filter(ticket => ticket.Ville.toLowerCase().includes(filters.location.toLowerCase()));
        }

        // Category filtering logic
        if (filters.category) {
            filtered = filtered.filter(ticket => ticket.Catégorie.toLowerCase() === filters.category.toLowerCase());
        }

        setFilteredTickets(filtered);
    };

    // Handle changes in filter inputs
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    // Handle changes in date range picker
    const handleDateChange = (dates) => {
        const [start, end] = dates;
        if (start && !end) {
            // Single date selection
            if (filters.startDate && start.toDateString() === filters.startDate.toDateString()) {
                setFilters(prevFilters => ({
                    ...prevFilters,
                    startDate: null,
                    endDate: null
                }));
            } else {
                setFilters(prevFilters => ({
                    ...prevFilters,
                    startDate: start,
                    endDate: null
                }));
            }
        } else {
            // Range date selection
            setFilters(prevFilters => ({
                ...prevFilters,
                startDate: start,
                endDate: end
            }));
        }
    };

    // Handle pagination changes
    const handleChangePage = (event, pageNumber) => setCurrentPage(pageNumber);

    // Open the popup dialog
    const handleClickOpen = (link) => {
        setSelectedLink(link);
        setOpen(true);
    };

    // Close the popup dialog
    const handleClose = () => {
        setOpen(false);
        setEmail(user ? user.email : '');
        setEmailError('');
    };

    // Validate email and redirect if valid
    const handleEmailSubmit = async () => {
        if (!user) {
            // Basic email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setEmailError('Please enter a valid email address.');
                return;
            }

            try {
                await axios.post('http://localhost:8000/api/email/storeEmail', { email });
            } catch (error) {
                setEmailError('Failed to store email. Please try again.');
                return;
            }
        }

        // If email is valid, redirect to the selected link in a new tab
        window.open(selectedLink, '_blank');
        handleClose();
    };

    // Calculate the tickets to be displayed on the current page
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

    return (
        <>
          <div className='ourEvent'>
            <EventShowCard/>
          </div>
          <div className="evenementsFnac">
            <h2 className="section-titleFa">TICKETS</h2>

            <div className="filters">
                <button
                    ref={buttonRef}
                    onClick={() => setShowCalendar(!showCalendar)}
                    style={{ color: filters.startDate || filters.endDate ? 'black' : 'inherit' }}
                >
                    {filters.startDate && filters.endDate
                        ? `${filters.startDate.toLocaleDateString()} - ${filters.endDate.toLocaleDateString()}`
                        : filters.startDate
                        ? filters.startDate.toLocaleDateString()
                        : "Date"}
                </button>
                {showCalendar && (
                    <div ref={calendarRef} className="calendar-container">
                        <DatePicker
                            selected={filters.startDate}
                            onChange={handleDateChange}
                            startDate={filters.startDate}
                            endDate={filters.endDate}
                            selectsRange
                            inline
                            isClearable
                        />
                    </div>
                )}
                <select name="location" value={filters.location} onChange={handleFilterChange} className="reduitOption">
                    <option value="">Filter..</option>
                    {availableLocations.map(location => (
                        <option key={location} value={location}>{location}</option>
                    ))}
                </select>
                <select name="category" value={filters.category} onChange={handleFilterChange} className="reduitOption">
                    <option value="">Filter..</option>
                    {availableCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            <Grid container spacing={2}>
                {loadingImages ? ( // Check if images are loading
                    <div className="loader-container">
                        <ClipLoader color="#007bff" size={150} /> {/* Display loader */}
                    </div>
                ) : currentTickets.length > 0 ? (
                    currentTickets.map(ticket => (
                        <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={ticket._id}>
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
                                    image={ticket["Lien de l'image"]}
                                    alt={ticket["Titre de l'offre"]}
                                    sx={{ borderRadius: '8px 8px 0 0' }}
                                />
                                <CardContent>
                                    <Typography
                                        gutterBottom
                                        variant="h6"
                                        component="div"
                                        sx={{ fontWeight: 'bold', fontSize: '18px' }}
                                    >
                                        {ticket["Titre de l'offre"].length > 10
                                            ? `${ticket["Titre de l'offre"].substring(0, 10)}...`
                                            : ticket["Titre de l'offre"]}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ marginBottom: '8px' }}
                                    >
                                        {ticket["Description"] ? ticket["Description"].substring(0, 100) + "..." : "No description available"}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: '#888', fontWeight: 'bold' }}
                                    >
                                        {new Date(ticket["Prochaine date"]).toLocaleDateString()}
                                    </Typography>
                                    <Typography
                                        component="a"
                                        href={ticket["Lien de l'offre"]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            color: '#03a9f4',
                                            textTransform: 'none',
                                            fontWeight: 'bold',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Learn More
                                    </Typography>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <p className="no-events-message">No events match the chosen filters.</p>
                )}
            </Grid>
            <div className="pagination">
                <Pagination
                    count={Math.ceil(filteredTickets.length / ticketsPerPage)}
                    page={currentPage}
                    onChange={handleChangePage}
                    variant="outlined"
                    color="primary"
                    siblingCount={0}
                    boundaryCount={1}
                    showFirstButton
                    showLastButton
                />
            </div>

            {/* Popup Dialog for Email Entry */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Redirecting to Event Page</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {user
                            ? 'A mail will be sent to your account. Click submit to continue.'
                            : 'Please enter your email address to be redirected to the event page.'
                        }
                    </DialogContentText>
                    {!user && (
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="standard"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!emailError}
                            helperText={emailError}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleEmailSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
        </>
    );
}

export default Evenements;
