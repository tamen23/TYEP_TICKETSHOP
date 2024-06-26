import React from 'react';
import './header.scss';
import logo from './logo.svg';

const Header = () => {
    return (
        <div className='header'>
            <div className='header__wrapper'>
                <div className="header__left">
                    <div className="header__logo">
                        <div className="ticket__logo">
                            TiCKETSHOP
                        </div>
                        <div className="underline"></div>
                    </div>
                    <div className="header__menu">
                        <nav>
                            <ul>
                                <li><a href="#"></a></li>
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
                                <a href="#">JE SUIS ORGANISEUR</a>
                            </div>
                            <div className='loginBtn'>
                                <a href="#">LOGIN</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
