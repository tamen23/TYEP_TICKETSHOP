import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Button, Typography, Box, Paper } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './profile.scss';

const Profile = ({ user, logout }) => {
    return (
        <Paper elevation={3} className='profile'>
            <Box p={2} className='profile__details'>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar alt="User Avatar" src="path_to_user_image.png" sx={{ width: 60, height: 60 }}>
                        <AccountCircleIcon />
                    </Avatar>
                    <Typography variant="h6" component="div" mt={1}>
                        {`Welcome, ${user.username || user.nom}`}
                    </Typography>
                </Box>
                <Box mt={2} className='profile__logout'>
                    <Button variant="contained" color="error" onClick={logout}>
                        Logout
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
};

export default Profile;
