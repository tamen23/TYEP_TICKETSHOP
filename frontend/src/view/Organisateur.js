import React from 'react';
import { Typography, Button, Container } from '@mui/material';
import backgroundImg from './marcela-laskoski-YrtFlrLo2DQ-unsplash.jpg'; // Assurez-vous de remplacer par le chemin correct
import './organisateur.scss';

const Organisateur = () => {
    return (
        <>
            <div className="organisation" style={{backgroundImage: `url(${backgroundImg})`}}>
                <Container maxWidth="lg" className="organisation__content">
                    <Typography variant="h2" className="organisation__title" gutterBottom>
                        BETTER, FASTER, STRONGER.
                    </Typography>
                    <Typography variant="subtitle1" className="organisation__subtitle" gutterBottom>
                        La billetterie qui vous redonne le contrôle et permet de mieux vendre vos événements en
                        développant vos communautés.
                    </Typography>
                    <div className="organisation__buttons">
                        <Button variant="contained" color="primary" size="large" style={{marginRight: 16}}>
                            Demander une démo
                        </Button>
                        <Button variant="outlined" color="primary" size="large">
                            Commencer - c’est gratuit
                        </Button>
                    </div>
                </Container>
                <Container maxWidth="lg" className="organisation__content">

                </Container>
            </div>

        </>
    );
};

export default Organisateur;
