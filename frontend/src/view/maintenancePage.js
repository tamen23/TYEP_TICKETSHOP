import React, { useState, useEffect } from 'react';
import './ComingSoonPage.css';

const ComingSoonPage = () => {
    const calculateTimeLeft = () => {
        const difference = +new Date('2024-12-31') - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        timerComponents.push(
            <span key={interval}>
                {timeLeft[interval]} {interval}{" "}
            </span>
        );
    });

    return (
        <div className="coming-soon">
            <h1>COMING SOON</h1>
            <div className="countdown">
                <div className="countdown-item">
                    <span>{timeLeft.days}</span>
                    <p>Days</p>
                </div>
                <div className="countdown-item">
                    <span>{timeLeft.hours}</span>
                    <p>Hr</p>
                </div>
                <div className="countdown-item">
                    <span>{timeLeft.minutes}</span>
                    <p>Min</p>
                </div>
                <div className="countdown-item">
                    <span>{timeLeft.seconds}</span>
                    <p>Sec</p>
                </div>
            </div>
        </div>
    );
};

export default ComingSoonPage;
