import React, { useState, useContext, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaSignOutAlt, FaTimes } from 'react-icons/fa';  // Import FaTimes for the close icon
import AuthContext from '../../context/AuthContext';
import ModalAuth from '../Shared/ModalAuth';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import OrganisateurSignUp from '../Organisateur/OrganisateurSignUp';
import './header.scss';
import '../Header/humberger.css';

const Humberger = ({ onShowApp, onShowOrganisateur, isOpen, toggleMenu }) => {
    const [showAuth, setShowAuth] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const [authMode, setAuthMode] = useState('login');
    const location = useLocation();
    const navigate = useNavigate();

    const handlerShowAuth = (mode) => {
        setAuthMode(mode);
        setShowAuth(true);
        toggleMenu();  // Close the menu when showing the auth modal
    };

    const handlerCloseAuth = () => {
        setShowAuth(false);
    };

    const handleLogout = useCallback(() => {
        logout();
        navigate('/');
        toggleMenu();  // Close the menu when logging out
    }, [logout, navigate, toggleMenu]);

    const handleProductionClick = useCallback((event) => {
        event.preventDefault();
        navigate('/soon');
        toggleMenu();  // Close the menu when navigating
    }, [navigate, toggleMenu]);

    const isOrganisateur = user && user.role === 'organisateur';

    return (
        <div className="humberHeader">
            <div className='mobileMenu__close' onClick={toggleMenu}>
                <FaTimes size={30} />
            </div>
            <div className='header__wrapper'>
                <div className="mobileMenu">
                    <nav>
                        <ul>
                            {isOrganisateur ? (
                                <>
                                    <li><Link to="/dashboard" onClick={toggleMenu}>DASHBOARD</Link></li>
                                    <li><Link to="/events" onClick={toggleMenu}>MY EVENTS</Link></li>
                                    <li><Link to="/contact" onClick={toggleMenu}>CONTACT</Link></li>
                                    <li><Link to="/create-event" onClick={toggleMenu}>CREATE-EVENT</Link></li>
                                    <li><Link to="ManagerFag" onClick={toggleMenu}>FAQ</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/" onClick={() => { onShowApp(); toggleMenu(); }}>HOME</Link></li>
                                    <li><Link to="/events" onClick={toggleMenu}>EVENEMENTS</Link></li>
                                    <li><Link to="#" onClick={(event) => { handleProductionClick(event); toggleMenu(); }}>CONCERTS</Link></li>
                                    <li><Link to="/contact" onClick={toggleMenu}>CONTACT</Link></li>
                                    <li><Link to="/organisation" onClick={toggleMenu}>BECOME A PARTNER</Link></li>
                                    <li><Link to="publicFag" onClick={toggleMenu}>FAQ</Link></li>
                                </>
                            )}
                        </ul>
                    </nav>

                    {/* Logout or Login/Signup */}
                    {user ? (
                        <div className="mobileMenu__logout" onClick={handleLogout}>
                            <FaSignOutAlt title="Logout" /> Logout
                        </div>
                    ) : (
                        <div className="mobileMenu__login" onClick={() => { handlerShowAuth('login'); toggleMenu(); }}>
                            Connexion / Inscription
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for Authentication */}
            {showAuth && (
                <ModalAuth show={showAuth} onClose={handlerCloseAuth}>
                    {location.pathname === '/organisation' && authMode === 'register' ? (
                        <OrganisateurSignUp />
                    ) : authMode === 'register' ? (
                        <Register close={handlerCloseAuth} switchToLogin={() => handlerShowAuth('login')} />
                    ) : (
                        <Login close={handlerCloseAuth} switchToRegister={() => handlerShowAuth('register')} />
                    )}
                </ModalAuth>
            )}
        </div>
    );
};

Humberger.propTypes = {
    onShowOrganisateur: PropTypes.func.isRequired,
    onShowApp: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    toggleMenu: PropTypes.func.isRequired,  // Ensure the prop is marked as required
};

export default Humberger;
