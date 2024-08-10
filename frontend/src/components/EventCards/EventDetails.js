// src/components/EventCards/EventDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import './EventDetails.scss';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/event/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) return <div>Loading...</div>;

  return (
    <div className="event-details">
      <h1>{event.name}</h1>
      <img src={`http://localhost:8000/${event.images[0]}`} alt={event.name} />
      <p>{event.description}</p>
      <p>Date: {event.date}</p>
      <p>Location: {event.venue}, {event.street_address}, {event.city}, {event.country}</p>
      <h3>Pricing</h3>
      <ul>
        {event.seat_categories.map((category, index) => (
          <li key={index}>{category.type} - {category.count} seats at {category.price} €</li>
        ))}
      </ul>
      <button>Buy Tickets</button>
    </div>
  );
};

export default EventDetails;
