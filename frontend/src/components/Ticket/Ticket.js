import React from 'react';
import './ticket.scss'; // Assurez-vous que l'importation est au sommet
import { CiCalendar } from "react-icons/ci";

const Ticket = () => {
    return (
        <div className="ticket">
            <h2>ROCK EN SEINE 2024</h2>
            <p>Par <a href="#">Rock En Seine</a></p>
            <div className="ticket__date">
                <div className='ticket__date__cale'>
                    <CiCalendar className='calendarImg' />
                </div>
                <div className='ticket__date__dates'>
                    <p>Du mer 21 août à 16:00</p>
                    <p>Du mer 21 août à 18:00</p>
                </div>
            </div>
            <div className="ticket__location">
                <p>Domaine national de Saint-Cloud</p>
            </div>
            <div className="ticket__price">
                <button>Maintenant à 98 $</button>
            </div>
            <div className="ticket__interest">
                <p>54 k sont intéressé·e·s</p>
            </div>
        </div>
    );
}

export default Ticket;
