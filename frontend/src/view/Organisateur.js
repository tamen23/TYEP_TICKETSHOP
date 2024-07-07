import React, { useState } from 'react';
import hero from './image.png';
import BackGroundImage from './anthony-delanoix-hzgs56Ze49s-unsplash.jpg';
import './organisateur.scss'; 
import OrganisateurSignUp from '../components/Organisateur/OrganisateurSignUp';

const Organisateur = () => {
    const [showOrganisateurAuth, setShowAuth] = useState(false);

    const handlerOrganisateur = () => {
        setShowAuth(true);
    };

    const closeModal = () => {
        setShowAuth(false);
    };

    return (
        <div className="organisation" style={{ backgroundImage: `url(${BackGroundImage})` }}>
            <div className='contenteOrganisation'>
                <div className='leftSection'>
                    <img src={hero} alt="Hero" className='heroImage' />
                </div>
                <div className='rightSection'>
                    <h1>Gérez facilement vos événements</h1>
                    <p>Ticketplace est une plateforme 100% en ligne de gestion d’événements incluant: billetterie en ligne et au guichet, inscriptions, invitations, contrôle d’accès, finance, marketing, etc... Elle permet l’administration à 360° et la supervision en temps réel de votre événement.</p>
                    <button className='createEventButton' onClick={handlerOrganisateur}>CRÉER UN ÉVÉNEMENT</button>
                </div>
            </div>
            {
                showOrganisateurAuth && <OrganisateurSignUp show={showOrganisateurAuth} onClose={closeModal}/>
            }
        </div>
    );
};

export default Organisateur;
