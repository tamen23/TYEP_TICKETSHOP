import React from 'react';
import Ticket from "../Ticket/Ticket";
import Calendar from "../Calendar/Calendar";
import('./horo.scss')
const Hero = () => {
    return (
        <div className="hero">
            <div className="hero__background">
                <div className="hero__background__container">
                    <div className="hero__background__container__ticket">
                        <Ticket/>
                    </div>
                    <div className='hero__background__container__calendar'>
                        <Calendar/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;
