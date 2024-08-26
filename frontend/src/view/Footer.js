import React from 'react';
import { Box, Typography, Link, Grid, Container } from '@mui/material';

const EventFooter = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 5,
                backgroundColor: 'primary.main',
                color: 'white',
                position: 'absolute', // positionnement absolu
                bottom: 0,
                left: 0,
                right: 0
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="space-between">
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom>
                            À propos
                        </Typography>
                        <Typography variant="body2">
                            Nous sommes dédiés à organiser les meilleurs événements pour vous.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom>
                            Liens Utiles
                        </Typography>
                        <Link href="/" color="inherit" underline="none">
                            Accueil
                        </Link>
                        <br />
                        <Link href="/events" color="inherit" underline="none">
                            Événements
                        </Link>
                        <br />
                        <Link href="/contact" color="inherit" underline="none">
                            Contactez-nous
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom>
                            Suivez-nous
                        </Typography>
                        <Link href="https://www.facebook.com" color="inherit" underline="none">
                            Facebook
                        </Link>
                        <br />
                        <Link href="https://www.twitter.com" color="inherit" underline="none">
                            Twitter
                        </Link>
                        <br />
                        <Link href="https://www.instagram.com" color="inherit" underline="none">
                            Instagram
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom>
                            Contact
                        </Typography>
                        <Typography variant="body2">
                            Email: info@evenements.com
                        </Typography>
                        <Typography variant="body2">
                            Téléphone: +123 456 7890
                        </Typography>
                    </Grid>
                </Grid>
                <Box textAlign="center" pt={5}>
                    <Typography variant="body2">
                        © {new Date().getFullYear()} TiCKETSHOP. Tous droits réservés.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default EventFooter;
