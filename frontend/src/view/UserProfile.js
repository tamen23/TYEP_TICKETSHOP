import React from 'react';
import { Box, Typography, Grid, Paper, Avatar, Divider, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import './UserProfile.scss';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    logout(); // Perform the logout operation
    navigate('/'); // Redirect to the homepage after logout
  };

  return (
    <div className="boxProfile">
      <Box sx={{ padding: 4, maxWidth: 900, margin: 'auto' }}>
        <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', marginBottom: 4 }}>
          <Avatar
            sx={{ width: 100, height: 100, margin: 'auto' }}
            src="/path-to-user-avatar.png"
          >
            {user?.prenom?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h4" sx={{ marginTop: 2 }}>
            Welcome, {`${user?.prenom} ${user?.nom}`}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Manage your info, privacy, and security to make your account more secure.
          </Typography>
          <Divider sx={{ marginY: 4 }} />
          <Button
            variant="contained"
            color="secondary"
            startIcon={<FaSignOutAlt />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Paper>

        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h5" sx={{ marginBottom: 4 }}>
            User Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>Name:</strong> {user?.nom || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>First Name:</strong> {user?.prenom || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>Email:</strong> {user?.email || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>Phone:</strong> {user?.telephone || 'N/A'}</Typography>
            </Grid>
            {user?.role === 'organisateur' && (
              <>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1"><strong>Structure Name:</strong> {user?.nomDeStructure || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1"><strong>Address:</strong> {user?.adresse || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1"><strong>Country:</strong> {user?.pays || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1"><strong>City:</strong> {user?.ville || 'N/A'}</Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      </Box>
    </div>
  );
};

export default UserProfile;
