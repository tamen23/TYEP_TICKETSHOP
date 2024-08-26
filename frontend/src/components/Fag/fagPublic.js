import React, { useState } from 'react';
import Footer from '../Footer/Footer';
import { height, positions } from '@mui/system';

const QuestionPublic = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const questions = [
        {
            question: "Do you provide support?",
            answer: "We offer customer support through various channels including email, chat, and phone."
        },
        {
            question: "How can I participate in the public event?",
            answer: "You can participate in the public event by registering online through our event portal. The event details, including date, time, and venue, will be sent to you via email upon successful registration."
        },
        {
            question: "What are the requirements for attending the event?",
            answer: "The event is open to all registered participants. However, you may need to bring a valid ID and the confirmation email for verification purposes."
        },
        {
            question: "Is there a fee to attend the event?",
            answer: "Some events may require a registration fee, while others are free. Please check the event details on our website for specific information."
        },
        {
            question: "Can I cancel my registration?",
            answer: "Yes, you can cancel your registration by contacting our support team or through the event portal. Please note that cancellation policies may vary depending on the event."
        },
        {
            question: "Will the event be available online?",
            answer: "Some events may be available for live streaming or recorded for later viewing. Please check the event details for availability."
        },
        {
            question: "What should I bring to the event?",
            answer: "We recommend bringing a valid ID, your registration confirmation, and any materials you may need for the event, such as a notebook or business cards."
        },
        {
            question: "Are meals provided at the event?",
            answer: "Meals may be provided depending on the event. Please check the event details or contact the organizers for specific information about catering."
        },
        {
            question: "Is there parking available at the event venue?",
            answer: "Parking availability varies by venue. Please refer to the event details or contact the venue directly for information on parking."
        },
        {
            question: "Can I bring a guest to the event?",
            answer: "This depends on the event's policies. Some events allow guests, while others require individual registration for each attendee. Please check the event details."
        },
        {
            question: "How can I stay updated on event changes?",
            answer: "We recommend subscribing to our newsletter or following our social media channels for the latest updates on event schedules, locations, and other important information."
        },
        {
            question: "Is there a dress code for the event?",
            answer: "Dress codes vary by event. We recommend checking the event details for any specific requirements or suggestions."
        }
    ];

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <>
            <div style={styles.faqContainer}>
                {questions.map((item, index) => (
                    <div key={index} style={styles.faqItem}>
                        <h3
                            style={{
                                ...styles.faqQuestion,
                                ...(activeIndex === index ? styles.activeQuestion : {})
                            }}
                            onClick={() => handleToggle(index)}
                        >
                            {item.question}
                        </h3>
                        {activeIndex === index && <p style={styles.faqAnswer}>{item.answer}</p>}
                    </div>
                ))}
            </div>
        <Footer />
        </>

    );
};

const styles = {
    faqContainer: {
        maxWidth: '800px',
        height: '100vh',
        margin: '0 auto',
        padding: '20px',
        fontFamily: "'Arial', sans-serif",
        position: 'relative',  // Corrected "positions" to "position"
        top: '150px'           // Corrected "top" to be a valid style
    },
    
    faqItem: {
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    faqQuestion: {
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        margin: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0'
    },
    activeQuestion: {
        color: '#007BFF'
    },
    faqAnswer: {
        fontSize: '16px',
        lineHeight: 1.5,
        marginTop: '10px',
        color: '#555'
    }
};

export default QuestionPublic;
