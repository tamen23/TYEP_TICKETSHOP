import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { ClipLoader } from 'react-spinners'; // Import the loader
import './EventCards.scss';

const EventCards = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingImages, setLoadingImages] = useState(true); // State to track image loading
  const itemsPerPage = 4; // Display 4 items per page

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

  const handleImageLoad = () => {
    setLoadingImages(false); // Set loading state to false once images are loaded
  };

  const getSmallestPrice = (seatCategories) => {
    const prices = seatCategories.map(category => category.price).filter(price => price > 0);
    return prices.length ? Math.min(...prices) : 'Free';
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = events.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(events.length / itemsPerPage);

  return (
    <div className="event-cards-container">
      <div className="event-cards">
        {currentEvents.map(event => (
          <div key={event._id} className="event-card">
            <div className="event-card-image">
              {loadingImages && <ClipLoader color="#007bff" />} {/* Display loader while images are loading */}
              <img 
                src={`http://localhost:8000/${event.images[0]}`} 
                alt={event.name} 
                onLoad={handleImageLoad} 
                style={{ display: loadingImages ? 'none' : 'block' }} // Hide image until loaded
              />
            </div>
            <div className="event-card-content">
              <h3>{event.name}</h3>
              <p>{new Date(event.date).toLocaleDateString()}</p>
              <p>{event.description}</p>
              <Link to={`/event/${event._id}`} className="event-card-button">Pay</Link>
            </div>
          </div>
        ))}
      </div>

      {events.length > itemsPerPage && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={index + 1 === currentPage ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventCards;
