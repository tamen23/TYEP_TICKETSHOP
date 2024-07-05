import React, { useState } from 'react';
import PropTypes from 'prop-types';  // Import PropTypes
import './header.scss';
import logo from './logo.svg';
import ModalAuth from '../Shared/ModalAuth';
import Login from '../Auth/Login';

const Header = ({ onShowOrganisateur, onShowApp }) => {
    const [showAuth, setShowAuth] = useState(false);

    const handlerShowAuth = () => {
        setShowAuth(true);
    };

    const handlerCloseAuth = () => {
        setShowAuth(false);
    };

    const handleOrganisateurClick = (e) => {
        e.preventDefault();
        if (typeof onShowOrganisateur === 'function') {
            onShowOrganisateur();
        }
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
                                <li><a href="#">DEVENIR PARTENAIRE</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className="hamburgerMenu"></div>
                <div className="header__right">
                    <div className="login">
                        <div className="child__menu">
                            <div className="org">
                                <a href="#" onClick={handleOrganisateurClick}>JE SUIS ORGANISEUR</a>
                            </div>
                            <div className='loginBtn'>
                                <a href="#" onClick={handlerShowAuth}>LOGIN</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                showAuth && (
                    <ModalAuth show={showAuth} onClose={handlerCloseAuth}>
                        <Login close={handlerCloseAuth} />
                    </ModalAuth>
                )
            }
        </div>
    );
};

Header.propTypes = {
    onShowOrganisateur: PropTypes.func.isRequired,
    onShowApp: PropTypes.func.isRequired
};

export default Header;
