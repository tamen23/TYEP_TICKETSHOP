import React from 'react';

const TicketList = ({ currentTickets, handleClickOpen }) => {
    return (
        <div className="tickets-containerFnac">
            {currentTickets.length > 0 ? (
                currentTickets.map(ticket => (
                    <div className="ticketfnac" key={ticket._id}>
                        <div className="ticket-link" onClick={() => handleClickOpen(ticket["Lien de l'offre"])}>
                            <img src={ticket["Lien de l'image"]} alt={ticket["Titre de l'offre"]} />
                            <div className="ticket-infoFnc">
                                <p>Location: {ticket.Ville}</p>
                                <p>Categories: {ticket.Catégorie}</p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="no-events-message">No events match the chosen filters.</p>
            )}
        </div>
    );
};

export default TicketList;
