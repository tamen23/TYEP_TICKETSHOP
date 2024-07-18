import React, { useEffect, useState } from 'react';
import './evenements.scss';
import api from '../../api';

const Evenements = () => {
    const [tickets, setTickets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 16; // Number of tickets to display per page

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

    // Calculate the tickets to be displayed on the current page
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Get total number of pages
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(tickets.length / ticketsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="evenementsFnac">
            <h2 className="section-titleFa">TICKETS</h2>
            <div className="tickets-containerFnac">
                {currentTickets.map(ticket => (
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
            <div className="pagination">
                {pageNumbers.map(number => (
                    <button className='pageBtn' key={number} onClick={() => paginate(number)}>
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Evenements;
