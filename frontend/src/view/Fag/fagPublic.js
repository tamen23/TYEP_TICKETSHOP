import React, { useState } from 'react';
import './FAQComponent.css';
import faqImage from './img.png'; // Import the image

const questionPublic = () => {
    // const [activeIndex, setActiveIndex] = useState(null);

    const questions = [
        {
            question: "Do you provide support?",
            answer: "Answer. We offer customer support through various channels including email, chat, and phone."
        },
        // Add more questions as needed
    ];

    console.log('Questions:', questions);

    const handleToggle = (index) => {
        console.log('Toggling index:', index);
        // setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="faq-container" style={{ border: '1px solid red' }}>
            jjj
        </div>
    );
};

export default questionPublic;
