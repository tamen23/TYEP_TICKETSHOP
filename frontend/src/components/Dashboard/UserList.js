// src/components/Dashboard/UserList.js
import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useNotifications } from '../../context/NotificationsContext'; // Correct import
import api from '../../api';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const { showNotification } = useNotifications(); // Destructure showNotification from useNotifications

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/auth/users?role=utilisateur');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]); // Ensure users is always an array
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        try {
            console.log(`Deleting user with id: ${id}`);
            await api.delete(`/auth/${id}`);
            setUsers(users.filter(user => user._id !== id));
            showNotification('User deleted successfully', 'success', 1000);
        } catch (error) {
            console.error('Error deleting user:', error);
            showNotification('Error deleting user', 'error', 1000);
        }
    };

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const itemsPerPage = 15; // Set the number of items per page to 15
    const paginatedUsers = users.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>User ID</TableCell>
                            <TableCell>Nom</TableCell>
                            <TableCell>Prénom</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Téléphone</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedUsers.length > 0 ? paginatedUsers.map((user, index) => (
                            <TableRow key={user._id}>
                                <TableCell>{(page - 1) * itemsPerPage + index + 1}</TableCell>
                                <TableCell>{user._id}</TableCell>
                                <TableCell>{user.nom}</TableCell>
                                <TableCell>{user.prenom}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.telephone}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="secondary" onClick={() => handleDelete(user._id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No users found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack spacing={2} alignItems="center" mt={2}>
                <Pagination
                    count={Math.ceil(users.length / itemsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    variant="outlined"
                    color="primary"
                />
            </Stack>
        </Box>
    );
};

export default UserList;
