import React from 'react';
import './filtrage.scss';

const Filters = ({ filters, handleFilterChange, availableCategories, availableDates }) => {
    return (
        <div className="filters">
            <div className="filter">
                <select name="dateRange" value={filters.dateRange} onChange={handleFilterChange}>
                    <option value="">Date</option>
                    {availableDates.map((date, index) => (
                        <option key={index} value={date}>{date}</option>
                    ))}
                </select>
            </div>
            <div className="filter">
                <select name="publisher" value={filters.publisher} onChange={handleFilterChange}>
                    <option value="">Publiées par</option>
                    <option value="fnac">Fnac</option>
                    <option value="particulier">Particulier</option>
                </select>
            </div>
            <div className="filter">
                <select name="type" value={filters.type} onChange={handleFilterChange}>
                    <option value="">Type de contrat</option>
                    <option value="concerts">Concerts</option>
                    <option value="tournee">Tournée</option>
                </select>
            </div>
            <div className="filter">
                <select name="category" value={filters.category} onChange={handleFilterChange}>
                    <option value="">Catégorie</option>
                    {availableCategories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            <div className="filter">
                <select name="period" value={filters.period} onChange={handleFilterChange}>
                    <option value="">Période</option>
                    <option value="Soir">Soir</option>
                    <option value="Nuit">Nuit</option>
                </select>
            </div>

        </div>
    );
};

export default Filters;
