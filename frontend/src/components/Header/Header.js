import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import PropTypes from 'prop-types';
import logo from './logo.svg';
import ModalAuth from '../Shared/ModalAuth';
import AuthContext from '../../context/AuthContext';
import Login from '../Auth/Login';
import Register from "../Auth/Register";
import OrganisateurSignUp from "../Organisateur/OrganisateurSignUp";
import Profile from '../Shared/Profile'; // Importer le composant Profile
import './header.scss';
import { CgProfile } from "react-icons/cg";

const Header = ({ onShowApp, onShowOrganisateur }) => {
    const [showAuth, setShowAuth] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const [authMode, setAuthMode] = useState('login');
    const location = useLocation();
    const navigate = useNavigate(); // Initialize useNavigate

    const handlerShowAuth = (mode) => {
        setAuthMode(mode);
        setShowAuth(true);
    };

    const handlerCloseAuth = () => {
        setShowAuth(false);
    };

    const toggleProfile = () => {
        setShowProfile(!showProfile);
    };

    const handleLogout = () => {
        logout();
    };

    const handleProductionClick = (event) => {
        event.preventDefault(); // Prevent default link behavior
        navigate('/soon'); // Redirect to /soon page
    };

    const isOrganisateur = user && user.role === 'organisateur'; // Vérifiez le rôle de l'utilisateur

    return (
        <div className='header'>
            <div className='header__wrapper'>
                <div className="header__left">
                    <Link to='/'>
                        <div className="header__logo">
                            <div className="ticket__logo">
                                <img src={logo} alt="TiCKETSHOP"/>
                                TiCKETSHOP
                            </div>
                            <div className="underlinel"></div>
                        </div>
                    </Link>
                    <div className="header__menu">
                        <nav>
                            <ul>
                                {isOrganisateur ? (
                                    <>
                                        <li><Link to="/dashboard">DASHBOARD</Link></li>
                                        <li><Link to="/events">MES ÉVÉNEMENTS</Link></li>
                                        <li><Link to="/contact">CONTACT</Link></li>
                                        <li><Link to="/profile">PROFIL</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li><a href="/" onClick={onShowApp}>HOME</a></li>
                                        <li><a href="#" onClick={handleProductionClick}>EVENEMENTS</a></li>
                                        <li><a href="#" onClick={handleProductionClick}>CONCERTS</a></li>
                                        <li><Link to="/contact">CONTACT</Link></li>
                                        <li><a href="#" onClick={handleProductionClick}>DEVENIR PARTENAIRE</a></li>
                                    </>
                                )}
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className="hamburgerMenu"></div>
                <div className="header__right">
                    <div className="login">
                        <div className="child__menu">
                            {user ? (
                                <>
                                    <div onClick={toggleProfile} className="profile-logo">
                                        <CgProfile className="profile-logo" />
                                    </div>
                                    {showProfile && (
                                        <Profile user={user} logout={handleLogout} />
                                    )}
                                </>
                            ) : (
                                <div className='top_menu'>
                                    <div className='itemLog'>
                                        <div className="org">
                                            {location.pathname !== '/organisation' ? (
                                                <Link to='/organisation'>JE SUIS ORGANISEUR</Link>
                                            ) : (
                                                <Link to='/'>JE SUIS UTILISATEUR</Link>
                                            )}
                                        </div>
                                        <div className='loginBtn'>
                                            <div className='loginA'>CONNEXION/INSCRIPTION</div>
                                            <div className='item-sign'>
                                                <div onClick={() => handlerShowAuth('login')} className='auth-button'>CONNEXION</div>
                                                <div onClick={() => handlerShowAuth('register')} className='auth-button'>INSCRIPTION</div>
                                                {showAuth && (
                                                    <ModalAuth
                                                        show={showAuth}
                                                        onClose={handlerCloseAuth}
                                                    >
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
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Header.propTypes = {
    onShowOrganisateur: PropTypes.func.isRequired,
    onShowApp: PropTypes.func.isRequired
};

export default Header;
