import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import ModalAuth from '../Shared/ModalAuth';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Login from '../Auth/Login';
import Register from "../Auth/Register";
import './header.scss';

const Header = ({ onShowApp, onShowOrganisateur }) => {
    const [showAuth, setShowAuth] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const [isLoginForCarriers, setIsLoginForCarriers] = useState(true);
    const [authClickClass, setAuthClickClass] = useState('');

    const handlerShowAuth = (isLogin) => {
        setIsLoginForCarriers(isLogin);
        setShowAuth(true);
        setAuthClickClass('container-authClick'); // Ajouter la classe lorsque l'un des boutons est cliqué
    };

    const handlerCloseAuth = () => {
        setShowAuth(false);
        setAuthClickClass(''); // Réinitialiser la classe lorsque le modal est fermé
    };

    const handleLogout = () => {
        logout();
    };

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
                            <div className="underline"></div>
                    </div>
                    </Link>
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
                                <div className='top_menu'>
                                    <div className='itemLog'>
                                        <div className="org">
                                            <Link to='/organisation'>JE SUIS ORGANISEUR</Link>
                                        </div>
                                        <div className='loginBtn'>
                                            <div className='loginA'>CONNECTION/INSCRIPTION</div>
                                            <div className='item-sign'>
                                                <div onClick={() => handlerShowAuth(true)} className={authClickClass}>CONNEXION</div>
                                                <div onClick={() => handlerShowAuth(false)} className={authClickClass}>INSCRIPTION</div>
                                                {showAuth && (
                                                    <ModalAuth
                                                        show={showAuth}
                                                        onClose={handlerCloseAuth}
                                                    >
                                                        {isLoginForCarriers ?
                                                          <Login close={handlerCloseAuth} switchToRegister={() => handlerShowAuth(false)} /> :
                                                          <Register close={handlerCloseAuth} switchToLogin={() => handlerShowAuth(true)} />}
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
