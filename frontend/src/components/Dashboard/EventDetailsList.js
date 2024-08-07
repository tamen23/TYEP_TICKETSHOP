import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import api from '../../api';

const EventDetailsList = () => {
    const [eventDetails, setEventDetails] = useState([]);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await api.get('/event/details');
                setEventDetails(response.data);
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };

        fetchEventDetails();
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell>Organizer Name</TableCell>
                        <TableCell>Organizer Email</TableCell>
                        <TableCell>Event Name</TableCell>
                        <TableCell>Capacity</TableCell>
                        <TableCell>Tickets Sold</TableCell>
                        <TableCell>Money In</TableCell>
                        <TableCell>Date of Event</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {eventDetails.map((eventDetail, index) => (
                        <TableRow key={eventDetail._id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{eventDetail.organizer?.nom}</TableCell>
                            <TableCell>{eventDetail.organizer?.email}</TableCell>
                            <TableCell>{eventDetail.name}</TableCell>
                            <TableCell>{eventDetail.capacity}</TableCell>
                            <TableCell>{eventDetail.ticketsSold}</TableCell>
                            <TableCell>{eventDetail.moneyIn}</TableCell>
                            <TableCell>{eventDetail.date}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default EventDetailsList;
