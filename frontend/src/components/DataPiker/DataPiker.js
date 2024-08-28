import React from 'react';
import { useLocation } from 'react-router-dom';
import './dataPicker.scss';

const DataPicker = () => {
    const location = useLocation();
    const { events } = location.state || {}; // Get the events from route state

    // Check if events data exists and is not empty
    if (!events || events.length === 0) {
        return (
            <div className="data-picker data-picker--empty">
                <p>Aucun événement pour cette date.</p>
            </div>
        );
    }

    return (
        <div className="data-picker">
            {events.map((event, index) => (
                <div key={index} className="data-picker__event">
                    <img
                        src={event['Lien de l\'image']}
                        alt={event['Titre de l\'offre']}
                        className="data-picker__image"
                    />
                    <div className="data-picker__details">
                        <h2 className="data-picker__title">{event['Titre de l\'offre']}</h2>
                        <p><strong>Date début :</strong> {event['Date début']}</p>
                        <p><strong>Date fin :</strong> {event['Date fin']}</p>
                        <p><strong>Ville :</strong> {event['Ville']}</p>
                        <p><strong>Catégorie :</strong> {event['Catégorie']}</p>
                        <p><strong>Prix :</strong> {event['Prix']} €</p>
                        <a
                            href={event['Lien de l\'offre']}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="data-picker__link"
                        >
                            Voir l'offre
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DataPicker;
