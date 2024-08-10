// src/components/Dashboard/OrganizerList.js
import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useNotifications } from '../../context/NotificationsContext'; // Correct import
import api from '../../api';

const OrganizerList = () => {
    const [organizers, setOrganizers] = useState([]);
    const [page, setPage] = useState(1);
    const { showNotification } = useNotifications(); // Destructure showNotification from useNotifications

    useEffect(() => {
        const fetchOrganizers = async () => {
            try {
                const response = await api.get('/auth/users?role=organisateur');
                setOrganizers(response.data);
            } catch (error) {
                console.error('Error fetching organizers:', error);
                setOrganizers([]); // Ensure organizers is always an array
            }
        };

        fetchOrganizers();
    }, []);

    const handleDelete = async (id) => {
        try {
            console.log(`Deleting organizer with id: ${id}`);
            await api.delete(`/auth/${id}`);
            setOrganizers(organizers.filter(organizer => organizer._id !== id));
            showNotification('Organizer deleted successfully', 'success', 1000);
        } catch (error) {
            console.error('Error deleting organizer:', error);
            showNotification('Error deleting organizer', 'error', 1000);
        }
    };

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const itemsPerPage = 15; // Set the number of items per page to 15
    const paginatedOrganizers = organizers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>Nom</TableCell>
                            <TableCell>Prénom</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Téléphone</TableCell>
                            <TableCell>Adresse</TableCell>
                            <TableCell>Pays</TableCell>
                            <TableCell>Ville</TableCell>
                            <TableCell>Code Postal</TableCell>
                            <TableCell>Nom de Structure</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedOrganizers.length > 0 ? paginatedOrganizers.map((organizer, index) => (
                            <TableRow key={organizer._id}>
                                <TableCell>{(page - 1) * itemsPerPage + index + 1}</TableCell>
                                <TableCell>{organizer.nom}</TableCell>
                                <TableCell>{organizer.prenom}</TableCell>
                                <TableCell>{organizer.email}</TableCell>
                                <TableCell>{organizer.telephone}</TableCell>
                                <TableCell>{organizer.adresse}</TableCell>
                                <TableCell>{organizer.pays}</TableCell>
                                <TableCell>{organizer.ville}</TableCell>
                                <TableCell>{organizer.codePostal}</TableCell>
                                <TableCell>{organizer.nomDeStructure}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="secondary" onClick={() => handleDelete(organizer._id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={11} align="center">No organizers found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack spacing={2} alignItems="center" mt={2}>
                <Pagination
                    count={Math.ceil(organizers.length / itemsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    variant="outlined"
                    color="primary"
                />
            </Stack>
        </Box>
    );
};

export default OrganizerList;
