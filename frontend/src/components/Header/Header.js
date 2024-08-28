import React, { useState, useContext, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaSignOutAlt, FaBars } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import logo from './logo.svg';
import ModalAuth from '../Shared/ModalAuth';
import AuthContext from '../../context/AuthContext';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import OrganisateurSignUp from '../Organisateur/OrganisateurSignUp';
import './header.scss';

const Header = ({ onShowApp, onShowOrganisateur }) => {
    const [showAuth, setShowAuth] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const [authMode, setAuthMode] = useState('login');
    const location = useLocation();
    const navigate = useNavigate();

    const handlerShowAuth = (mode) => {
        setAuthMode(mode);
        setShowAuth(true);
    };

    const handlerCloseAuth = () => {
        setShowAuth(false);
    };

    const toggleProfile = useCallback(() => {
        setShowProfile(prevShowProfile => !prevShowProfile);
    }, []);

    const handleLogout = useCallback(() => {
        logout();
        navigate('/');
    }, [logout, navigate]);

    const handleProductionClick = useCallback((event) => {
        event.preventDefault();
        navigate('/soon');
    }, [navigate]);

    const isOrganisateur = user && user.role === 'organisateur';

    // Determine the CSS class for the header based on the current path
    const headerClass = location.pathname === '/events' ? 'header events-header' : 'header';

    return (
        <div className={headerClass}>
            <div className='header__wrapper'>
                <div className="header__left">
                    <Link to='/'>
                        <div className="header__logo">
                            <div className="ticket__logo">
                                <img src={logo} alt="TiCKETSHOP" style={{ display: 'none' }} />
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
                                        <li><Link to="/events">MY EVENTS</Link></li>
                                        <li><Link to="/contact">CONTACT</Link></li>
                                        <li><Link to="/create-event">CREATE-EVENT</Link></li>
                                        <li><Link to="ManagerFag">FAQ</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Link to="/" onClick={onShowApp}>HOME</Link></li>
                                        <li><Link to="/events">EVENEMENTS</Link></li>
                                        <li><Link to="#" onClick={handleProductionClick}>CONCERTS</Link></li>
                                        <li><Link to="/contact">CONTACT</Link></li>
                                        <li><Link to="/organisation">BECOME A PARTNER</Link></li>
                                        <li><Link to="publicFag">FAQ</Link></li>
                                       
                                        
                                    </>
                                )}
                            </ul>
                        </nav>
                    </div>
                </div>
                {/* Utilisation de l'icône FaBars pour le menu hamburger */}
                <div className="hamburgerMenu" onClick={() => {/* logique pour ouvrir le menu mobile */}}>
                    <FaBars size={30} color="#fff" />
                </div>
                <div className="header__right">
                    <div className="login">
                        <div className="child__menu">
                            {user ? (
                                <div className="profile-logo" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <Link to='/profil'>
                                        <CgProfile className="profile-logo" />
                                    </Link>
                                    <div className="logout-icon" onClick={handleLogout}>
                                        <FaSignOutAlt title="Logout" />
                                    </div>
                                </div>
                            ) : (
                                <div className='top_menu'>
                                    <div className='itemLog'>
                                        <div className="org">
                                            <Link to={location.pathname !== '/organisation' ? '/organisation' : '/'}>
                                                {location.pathname !== '/organisation' ? 'Je suis organisateur' : 'JE SUIS UTILISATEUR'}
                                            </Link>
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
    onShowApp: PropTypes.func.isRequired,
};

export default Header;
