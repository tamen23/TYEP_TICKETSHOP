import React from 'react';
import { Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';
import { Box, Button, Typography, AppBar, Toolbar } from '@mui/material';
import UserList from './UserList';
import OrganizerList from './OrganizerList';
import EventList from './EventList';
import EventDetailsList from './EventDetailsList';
import AuthContext from '../../context/AuthContext';
import './AdminDashboard.scss';


const AdminDashboard = () => {
    const { user } = React.useContext(AuthContext);
    const location = useLocation();

    return (
        <Box display="flex" position="relative" top="70px">
            <Box width="250px" bgcolor="#f0f0f0" p={2} height="100vh" position="fixed">
                <Typography variant="h6" gutterBottom>Welcome, {user.username}</Typography>
                <hr />
                <Button component={Link} to="/admin-dashboard/users" fullWidth>Users</Button>
                <Button component={Link} to="/admin-dashboard/organizers" fullWidth>Organizers</Button>
                <Button component={Link} to="/admin-dashboard/events" fullWidth>Events</Button>
                <Button component={Link} to="/create-event" fullWidth variant="contained" color="primary">Create Event</Button>
            </Box>
            <Box flex={1} ml="250px">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Admin Dashboard
                        </Typography>
                        <Typography variant="body1">
                            Welcome, {user.username}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box p={3}>
                    <Routes>
                        <Route path="/" element={<Navigate to="users" />}/>
                        <Route path="users" element={<UserList />} />
                        <Route path="organizers" element={<OrganizerList />} />
                        <Route path="events" element={<EventList />} />
                        <Route path="event-details" element={<EventDetailsList />} />
                    </Routes>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminDashboard;