import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const events = [
    { name: 'Event 1', lat: 48.8566, lng: 2.3522, address: 'Paris, France' },
    { name: 'Event 2', lat: 48.8584, lng: 2.2945, address: 'Eiffel Tower, Paris' },
];

const Map = () => {
    useEffect(() => {
        const map = L.map('map').setView([48.8566, 2.3522], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        events.forEach(event => {
            L.marker([event.lat, event.lng])
                .addTo(map)
                .bindPopup(`<b>${event.name}</b><br>${event.address}`);
        });

        return () => {
            map.remove();
        };
    }, []);

    return (
        <div id="map" style={{ height: '500px', width: '100%' }}></div>
    );
};

export default Map;
