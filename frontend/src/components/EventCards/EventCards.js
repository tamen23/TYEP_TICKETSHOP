import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import './EventCards.scss';

const EventCards = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/event/approved');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching approved events:', error);
      }
    };

    fetchEvents();
  }, []);

  const getSmallestPrice = (seatCategories) => {
    const prices = seatCategories.map(category => category.price).filter(price => price > 0);
    return prices.length ? Math.min(...prices) : 'Free';
  };

  return (
    <div className="event-cards">
      {events.map(event => (
        <div key={event._id} className="event-card">
          <img src={`http://localhost:8000/${event.images[0]}`} alt={event.name} />
          <h3>{event.name}</h3>
          <p>{event.date}</p>
          <p>{getSmallestPrice(event.seat_categories)} €</p>
          <Link to={`/event/${event._id}`}>View Event</Link>
        </div>
      ))}
    </div>
  );
};

export default EventCards;
