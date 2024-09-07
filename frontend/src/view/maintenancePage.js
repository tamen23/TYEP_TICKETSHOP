import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import './ComingSoonPage.css';

const ComingSoonPage = () => {
    const navigate = useNavigate();
    
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
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            // If the countdown is over, redirect to Home page
            if (Object.keys(newTimeLeft).length === 0) {
                navigate('/');
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, navigate]);

    return (
        <>
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

                <p className="go-back-home">Go back <Link to="/">Home</Link></p>
            </div>
            <Footer />
        </>
    );
};

export default ComingSoonPage;
