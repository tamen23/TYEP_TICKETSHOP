import React, { useEffect, useState } from 'react';
import './ticket.scss';
import { CiCalendar } from "react-icons/ci";
import api from '../../api'; // Adjust the import according to your file structure

const Ticket = () => {
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await api.get('/ticket/getEvenement');
                const events = response.data;

                // Assuming events is an array of event objects with a startDate property
                const nearestEvent = events.reduce((prev, curr) => {
                    const prevDate = new Date(prev['Date début']);
                    const currDate = new Date(curr['Date début']);
                    return (currDate < prevDate) ? curr : prev;
                });

                setEvent(nearestEvent);
            } catch (error) {
                console.error('Error fetching event data:', error);
            }
        };

        fetchEventData();
    }, []);

    if (!event) {
        return <div>Loading...</div>;
    }

    return (
        <div className="ticket">
            <h2>{event['Titre de l\'offre']}</h2>
            <p>Par <a href="#">{event['Catégorie']}</a></p>
            <div className="ticket__date">
                <div className='ticket__date__cale'>
                    <CiCalendar className='calendarImg' />
                </div>
                <div className='ticket__date__dates'>
                    <p>Du {new Date(event['Date début']).toLocaleString()}</p>
                    <p>Au {new Date(event['Date fin']).toLocaleString()}</p>
                </div>
            </div>
            <div className="ticket__location">
                <p>{event['Ville']}</p>
            </div>
            <div className="ticket__price">
                <a href={event['Lien de l\'offre']} target="_blank" rel="noopener noreferrer">
                    <button>Maintenant à {event['Prix']} $</button>
                </a>
            </div>
            <div className="ticket__interest">
                <p>{event['Nombre d\'événements']} sont intéressé·e·s</p>
            </div>
        </div>
    );
}

export default Ticket;
