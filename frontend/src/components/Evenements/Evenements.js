import React from 'react';
import './evenements.scss';
import musicImage from './hero.jpg'; // Replace with the correct path to your image
import chaplinImage from './hero.jpg'; // Replace with the correct path to your image

const Evenements = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return (
        <div className="evenements">
            <h2 className="section-title">TICKETS</h2>
            <div className="tickets-container">
                <div className="tickets-container__ticket-column">
                    <div className="tickets-container__more">
                        <div>
                            <p>Partnership to bring power devices based on</p>
                            <p>Soitec’s cutting-edge SmartSiC™ silicon</p>
                            <p>carbide wafers to X-FAB’s extensive fabless client network</p>
                        </div>
                        <div className="btn">
                            <a href="#">Read More</a>
                        </div>
                    </div>
                    <div className="tickets-container__image">
                        <img src={chaplinImage} alt="chaplin"/>
                    </div>
                    <div className="tickets-container__date">
                        <div className="tickets-container__date__time">
                            <p>{`${year}-${month}-${day}`}</p>
                        </div>
                        <div className="tickets-container__date__line"></div>
                        <div className="tickets-container__date__desc">
                            <p>Tout les Billets Music Rap et autre</p>
                            <p>Payer votre billet plus mochere que habituellement</p>
                            <p>Plus de 50 concerts ce mois-ci – faites votre choix !</p>
                        </div>
                    </div>
                </div>
                <div className="tickets-container__ticket-column">
                    <div className="tickets-container__more">
                        <div>
                            <p>Partnership to bring power devices based on</p>
                            <p>Soitec’s cutting-edge SmartSiC™ silicon</p>
                            <p>carbide wafers to X-FAB’s extensive fabless client network</p>
                        </div>
                        <div className="btn">
                            <a href="#">Read More</a>
                        </div>
                    </div>
                    <div className="tickets-container__image">
                        <img src={chaplinImage} alt="chaplin"/>
                    </div>
                    <div className="tickets-container__date">
                        <div className="tickets-container__date__time">
                            <p>{`${year}-${month}-${day}`}</p>
                        </div>
                        <div className="tickets-container__date__line"></div>
                        <div className="tickets-container__date__desc">
                            <p>Tout les Billets Music Rap et autre</p>
                            <p>Payer votre billet plus mochere que habituellement</p>
                            <p>Plus de 50 concerts ce mois-ci – faites votre choix !</p>
                        </div>
                    </div>
                </div>
                <div className="tickets-container__ticket-column">
                    <div className="tickets-container__more">
                        <div>
                            <p>Partnership to bring power devices based on</p>
                            <p>Soitec’s cutting-edge SmartSiC™ silicon</p>
                            <p>carbide wafers to X-FAB’s extensive fabless client network</p>
                        </div>
                        <div className="btn">
                            <a href="#">Read More</a>
                        </div>
                    </div>
                    <div className="tickets-container__image">
                        <img src={chaplinImage} alt="chaplin"/>
                    </div>
                    <div className="tickets-container__date">
                        <div className="tickets-container__date__time">
                            <p>{`${year}-${month}-${day}`}</p>
                        </div>
                        <div className="tickets-container__date__line"></div>
                        <div className="tickets-container__date__desc">
                            <p>Tout les Billets Music Rap et autre</p>
                            <p>Payer votre billet plus mochere que habituellement</p>
                            <p>Plus de 50 concerts ce mois-ci – faites votre choix !</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Evenements;
