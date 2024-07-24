import React from 'react';
import './searchBar.scss';

const SearchBar = ({ filters, handleFilterChange, handleSearchClick }) => {
    return (
        <div className="search-bar">
            <div className="search-barContent">
                <div className="input_wraper">
                    <div>
                        <input
                            type="text"
                            name="title"
                            placeholder="Intitulé de poste, mots-clés ou entreprise"
                            className="inBar"
                            value={filters.title}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
                <div className="input_wraper1">
                    <input
                        type="text"
                        name="location"
                        placeholder="Ville, département, code postal ou « Télétravail »"
                        className="inBar"
                        value={filters.location}
                        onChange={handleFilterChange}
                    />
                </div>
                <button className="search-button" onClick={handleSearchClick}>Rechercher</button>
            </div>
        </div>
    );
};

export default SearchBar;
