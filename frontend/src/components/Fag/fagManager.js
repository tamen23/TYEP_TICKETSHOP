import React, { useState } from 'react';
import Footer from '../Footer/Footer';

const EventManagerFAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const questions = [
        {
            question: "How do you ensure smooth coordination among different teams during an event?",
            answer: "Effective communication and clear delegation of responsibilities are key. We use project management tools and regular meetings to keep everyone aligned on tasks and timelines."
        },
        {
            question: "What strategies do you use to handle last-minute changes or emergencies during an event?",
            answer: "We always have contingency plans in place for potential issues. A crisis management team is on standby to address any unexpected situations swiftly and efficiently."
        },
        {
            question: "How do you measure the success of an event?",
            answer: "Success is measured by attendee satisfaction, engagement levels, and whether the event meets its predefined goals. We gather feedback through surveys and analyze data such as attendance rates and social media engagement."
        },
        {
            question: "How do you manage the budget for an event?",
            answer: "Budget management involves detailed planning, tracking expenses closely, and negotiating with vendors for the best rates. We also build in a contingency fund to cover unexpected costs."
        },
        {
            question: "What tools do you use for event planning and management?",
            answer: "We use a combination of project management software, registration platforms, and communication tools to streamline the planning process and keep everything organized."
        },
        {
            question: "How do you ensure that all legal and safety regulations are met during an event?",
            answer: "We work closely with legal advisors and safety consultants to ensure compliance with all local regulations. We also conduct risk assessments and have safety protocols in place for all events."
        },
        {
            question: "How do you manage the logistics of large-scale events?",
            answer: "Logistics are managed through detailed planning, from transportation and accommodation to venue setup and breakdown. We coordinate with vendors, venue staff, and our internal teams to ensure everything runs smoothly."
        },
        {
            question: "How do you select and manage vendors for events?",
            answer: "Vendors are selected based on their reliability, quality of service, and cost-effectiveness. We maintain strong relationships with trusted vendors and ensure clear contracts are in place to avoid misunderstandings."
        },
        {
            question: "How do you ensure a high level of attendee engagement during an event?",
            answer: "We design the event to be interactive and engaging, with activities, networking opportunities, and dynamic content. We also use technology like event apps to facilitate engagement."
        },
        {
            question: "How do you handle feedback and post-event analysis?",
            answer: "After the event, we gather feedback from attendees, stakeholders, and team members. We analyze this data to identify areas of improvement and successes, which informs our planning for future events."
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
        height: '110vh',
        margin: '0 auto',
        padding: '20px',
        fontFamily: "'Arial', sans-serif",
        position: 'relative',  // Corrected "positions" to "position"
        top: '100px'           // Corrected "top" to be a valid style
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

export default EventManagerFAQ;
