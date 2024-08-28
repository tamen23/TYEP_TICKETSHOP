import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Grid, Typography, Link, Box } from '@mui/material';

const Footer = () => {
    const location = useLocation();
    const isOrganisationPage = location.pathname === '/organisation';

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: isOrganisationPage ? '#000' : '#333',
                color: isOrganisationPage ? '#fff' : '#ccc',
                height: '110px',
                textAlign: 'center',
                position: isOrganisationPage ? 'absolute' : 'relative',
                bottom: isOrganisationPage ? 0 : 'auto',
                left: 0,
                right: 0,
                display: 'flex',
                alignItems: 'center',
            }}
        >
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
    );
};

export default Footer;
