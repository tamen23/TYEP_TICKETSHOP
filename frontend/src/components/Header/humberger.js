import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import './humberger.css';

const Humberger = ({ isOpen, toggleMenu, onShowApp, handleProductionClick }) => {
    const { user, logout } = React.useContext(AuthContext);

    return (
        <div className={`humberger-menu ${isOpen ? 'open' : ''}`}>
            <div className="humberger-menu__header">
                <FaTimes onClick={toggleMenu} size={30} color="#fff" />
            </div>
            <nav className="humberger-menu__nav">
                <ul>
                    {user ? (
                        <>
                            <li><Link to='/profil' onClick={toggleMenu}>Profile</Link></li>
                            <li><Link to='#' onClick={() => { logout(); toggleMenu(); }}>Logout</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/" onClick={() => { onShowApp(); toggleMenu(); }}>Home</Link></li>
                            <li><Link to="/events" onClick={toggleMenu}>Events</Link></li>
                            <li><Link to="#" onClick={(e) => { handleProductionClick(e); toggleMenu(); }}>Concerts</Link></li>
                            <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
                            <li><Link to="/organisation" onClick={toggleMenu}>Become a Partner</Link></li>
                            <li><Link to="publicFag" onClick={toggleMenu}>FAQ</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
};

Humberger.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggleMenu: PropTypes.func.isRequired,
    onShowApp: PropTypes.func.isRequired,
    handleProductionClick: PropTypes.func.isRequired,
};

export default Humberger;
