import React, { useState } from 'react';
import './description.scss';
import eventImage from '../Hero/hero.jpg';
import annonce from './img.png';
import ModalAuth from '../Shared/ModalAuth';
import Map from '../Map/Map'; // Assurez-vous que le chemin d'importation est correct

const Description = () => {
    const [showMap, setShowMap] = useState(false);

    const handleMap = (e) => {
        e.preventDefault();
        setShowMap(true);
    };

    const closeModal = () => {
        setShowMap(false);
    };

    return (
        <div className="description-container">
            <div className="banner-image">
                <img src={annonce} alt="Event Banner" className="banner-img" />
            </div>
            <div className="details-container">
                <h3 className="category">Manifestations</h3>
                <h1>Festival Paris l'été 2024</h1>
                <div className="event-info">
                    <p><span className="icon">🗓️</span> Jusqu'au 16/07/2024</p>
                    <p><span className="icon">📍</span><a href="#" onClick={handleMap}>Lieux divers Vérifier | Paris</a></p>
                </div>
                <p className="description">
                    Le Festival Paris l'été revient dans la capitale et ses alentours du 3 au 16 juillet 2024.
                    Au programme, théâtre, danse, cirque ou encore musique s’empareront de nombreux lieux emblématiques
                    et insolites faciliter l’accès du plus grand nombre à l’art et à la culture! On vous dit tout ce
                    qu'il faut savoir pour préparer votre été juste ici!
                </p>
                <div className="main-image">
                    <img src={eventImage} className='imageResi' alt="Festival Image" />
                </div>
                <div className="additional-info">
                    <h2>Festival Paris l'été 2024 : le programme</h2>
                    <p>Les artistes présents au Festival Paris l'été 2024</p>
                    <p>Le Festival Paris l’été vous donne rendez-vous du 3 au 16 juillet 2024, et vous pouvez dès à présent découvrir les noms des artistes de cette nouvelle édition :</p>
                    <ul>
                        <li>Filipe Lourenço</li>
                        <li>Johan Papaconstantino</li>
                        <li>Olivier Dubois</li>
                        <li>Carmen Mehnert et Anne Schmidt</li>
                        <li>Julie Beres</li>
                        <li>Sébastien Barrier</li>
                        <li>Johana Giacardi</li>
                        <li>Adrien M et Claire B</li>
                        <li>Luke Jerram</li>
                        <li>Olivier Normand</li>
                        <li>Galactic Ensemble</li>
                        <li>DJ Wonderbraz</li>
                        <li>et bien d'autres !</li>
                    </ul>
                </div>
            </div>

            {
                showMap &&
                <ModalAuth onClose={closeModal}>
                    <Map />
                </ModalAuth>
            }
        </div>
    );
};

export default Description;
