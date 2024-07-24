import React, { useEffect, useState, useContext } from 'react';
import './evenements.scss';
import api from '../../api';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import Filters from './Filters';
import SearchBar from './SearchBar';
import TicketList from './TicketList';
import DialogComponent from './DialogComponent';

const Evenements = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 16;
    const [filters, setFilters] = useState({
        title: '',
        location: '',
        category: '',
        dateRange: '',
        period: '',
        publisher: ''
    });
    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState('');
    const [email, setEmail] = useState(user ? user.email : '');
    const [emailError, setEmailError] = useState('');

    const fetchTickets = async () => {
        try {
            const response = await api.get('/ticket/getEvenement');
            const ticketsData = response.data;
            setTickets(ticketsData);
            setFilteredTickets(ticketsData);
            setAvailableCategories([...new Set(ticketsData.map(ticket => ticket.Catégorie))]);
            setAvailableDates(getUniqueDates(ticketsData));
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    const getUniqueDates = (tickets) => {
        const allDates = tickets.map(ticket => new Date(ticket['Prochaine lieu, date et heure'].split(', ')[1]));
        const uniqueDates = Array.from(new Set(allDates.map(date => date.toISOString().split('T')[0])));
        return uniqueDates;
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters]);

    const applyFilters = () => {
        let filtered = tickets;

        if (filters.title) {
            filtered = filtered.filter(ticket =>
                ticket['Titre de l\'offre'].toLowerCase().includes(filters.title.toLowerCase())
            );
        }

        if (filters.location) {
            filtered = filtered.filter(ticket =>
                ticket.Ville.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        if (filters.category) {
            filtered = filtered.filter(ticket =>
                ticket.Catégorie.toLowerCase() === filters.category.toLowerCase()
            );
        }

        if (filters.dateRange) {
            filtered = filtered.filter(ticket => {
                const ticketDate = new Date(ticket['Prochaine lieu, date et heure'].split(', ')[1]);
                return ticketDate.toISOString().split('T')[0] === filters.dateRange;
            });
        }

        if (filters.period) {
            filtered = filtered.filter(ticket => {
                const ticketTime = new Date(ticket['Prochaine lieu, date et heure'].split(', ')[1]).getHours();
                if (filters.period === 'Soir') {
                    return ticketTime >= 18 && ticketTime < 24;
                } else if (filters.period === 'Nuit') {
                    return ticketTime >= 0 && ticketTime < 6;
                }
                return true;
            });
        }

        if (filters.publisher) {
            filtered = filtered.filter(ticket => ticket.Publisher.toLowerCase() === filters.publisher.toLowerCase());
        }

        setFilteredTickets(filtered);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleSearchClick = () => {
        applyFilters();
    };

    const handleChangePage = (event, pageNumber) => setCurrentPage(pageNumber);

    const handleClickOpen = (link) => {
        setSelectedLink(link);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEmail(user ? user.email : '');
        setEmailError('');
    };

    const handleEmailSubmit = async () => {
        if (!user) {
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

        window.open(selectedLink, '_blank');
        handleClose();
    };

    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

    return (
        <div className="evenementsFnac">
            <h2 className="section-titleFa">TICKETS</h2>

            <SearchBar filters={filters} handleFilterChange={handleFilterChange} handleSearchClick={handleSearchClick} />

            <Filters
                filters={filters}
                availableCategories={availableCategories}
                availableDates={availableDates}
                handleFilterChange={handleFilterChange}
            />

            <TicketList currentTickets={currentTickets} handleClickOpen={handleClickOpen} />

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

            <DialogComponent
                open={open}
                handleClose={handleClose}
                handleEmailSubmit={handleEmailSubmit}
                user={user}
                email={email}
                setEmail={setEmail}
                emailError={emailError}
            />
        </div>
    );
};

export default Evenements;
