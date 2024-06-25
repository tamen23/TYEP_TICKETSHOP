import React, {Component} from 'react';
import('./header.scss');

const  Header =()=> {

        return (
            <div className='header'>
                <div className='header__wrapper'>
                    <div className="header__left">
                        <div className="header__logo">
                            <div className="ticket__logo"></div>
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
                                    <a>JE SUIS ORGANISEUR</a>
                                </div>
                                <div>
                                    <a>LOGIN</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

}

export default Header