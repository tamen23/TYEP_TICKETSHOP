import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import './header.scss';
import logo from './logo.svg';
import ModalAuth from '../Shared/ModalAuth';
import Login from '../Auth/Login';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Header = ({ onShowApp, onShowOrganisateur }) => {
    const [showAuth, setShowAuth] = useState(false);
    const { user, logout } = useContext(AuthContext);

    // Handler to show authentication modal
    const handlerShowAuth = () => {
        setShowAuth(true);
    };

    // Handler to close authentication modal
    const handlerCloseAuth = () => {
        setShowAuth(false);
    };

    // Handler for user logout
    const handleLogout = () => {
        logout();
    };

    return (
        <div className='header'>
            <div className='header__wrapper'>
                <div className="header__left">
                    <div className="header__logo">
                        <div className="ticket__logo">
                            <img src={logo} alt="TiCKETSHOP" />
                            TiCKETSHOP
                        </div>
                        <div className="underline"></div>
                    </div>
                    <div className="header__menu">
                        <nav>
                            <ul>
                                <li><a href="#" onClick={onShowApp}>HOME</a></li>
                                <li><a href="#">EVENEMENTS</a></li>
                                <li><a href="#">CONCERTS</a></li>
                                <li><a href="#" onClick={onShowOrganisateur}>DEVENIR PARTENAIRE</a></li>
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
                                    <span>Welcome, {user.role === 'admin' ? user.username : user.nom}</span>
                                    <button onClick={handleLogout}>Logout</button>
                                </>
                            ) : (
                                <>
                                    <div className="org">
                                        <Link to='/organisation'>JE SUIS ORGANISEUR</Link>
                                    </div>
                                    <div className='loginBtn'>
                                        <a href="#" onClick={handlerShowAuth}>CONNECTION/INSCRIPTION</a>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showAuth && (
                <ModalAuth show={showAuth} onClose={handlerCloseAuth}>
                    <Login close={handlerCloseAuth} />
                </ModalAuth>
            )}
        </div>
    );
};

Header.propTypes = {
    onShowOrganisateur: PropTypes.func.isRequired,
    onShowApp: PropTypes.func.isRequired
};

export default Header;
