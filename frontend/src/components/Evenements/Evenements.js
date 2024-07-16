import React, { useEffect, useState } from 'react';
import './evenements.scss';
import api from '../../api';

const Evenements = () => {
    const [tickets, setTickets] = useState([]);

    const fetchTickets = async () => {
        try {
            const response = await api.get('/ticket/getEvenement');
            setTickets(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    return (
        <div className="evenementsFnac">
            <h2 className="section-titleFa">TICKETS</h2>
            <div className="tickets-containerFnac">
                {tickets.map(ticket => (
                    <div className="ticketfnac" key={ticket._id}>
                        <img src={ticket["Lien de l'image"]} alt={ticket["Titre de l'offre"]} />
                        <div className="ticket-infoFnc">
                            <h3>{ticket["Titre de l'offre"]}</h3>
                            <p>From ${ticket.Prix}</p>
                            <p>Number of events: {ticket["Nombre d'événements"]}</p>
                            <p>Location: {ticket.Ville}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Evenements;
