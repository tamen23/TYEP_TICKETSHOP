import React, { useState, useEffect } from 'react';
import './calendar.scss';

const Calendar = () => {
    const date = new Date();
    const [month, setMonth] = useState(date.getMonth());
    const [year, setYear] = useState(date.getFullYear());
    const today = date.getDate();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    useEffect(() => {
        // Handle any additional effects when month or year changes
    }, [month, year]);

    const prevMonth = () => {
        if (month === 0) {
            setMonth(11);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    };

    const nextMonth = () => {
        if (month === 11) {
            setMonth(0);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    };

    const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

    return (
        <div className="calendar">
            <div className="calendar__header">
                <div className="calendar__icon">
                    <i className="icon"></i>
                </div>
                <div className="calendar__title">Trouver vos Tickets</div>
            </div>
            <div className="calendar__body">
                <div className="calendar__month">
                    <span>{monthName} {year}</span>
                </div>
                <div className="calendar__weekdays">
                    <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
                </div>
                <div className="calendar__days">
                    {generateDays(year, month, today, currentMonth, currentYear).map((day, index) => (
                        <div key={index} className={`calendar__day ${day.disabled ? 'calendar__day--disabled' : ''} ${day.isToday ? 'calendar__day--today' : ''}`}>
                            {day.date}
                        </div>
                    ))}
                </div>
            </div>
            <div className="calendar__footer">
                <button className="calendar__nav calendar__nav--prev" onClick={prevMonth}>&lt;</button>
                <button className="calendar__nav calendar__nav--next" onClick={nextMonth}>&gt;</button>
            </div>
        </div>
    );
};

const generateDays = (year, month, today, currentMonth, currentYear) => {
    const date = new Date(year, month, 1);
    const days = [];

    const prevMonthDays = new Date(year, month, 0).getDate();
    const firstDayIndex = date.getDay();
    for (let i = firstDayIndex; i > 0; i--) {
        days.push({ date: prevMonthDays - i + 1, disabled: true, isToday: false });
    }

    const currentMonthDays = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= currentMonthDays; i++) {
        const isToday = i === today && month === currentMonth && year === currentYear;
        days.push({ date: i, disabled: false, isToday });
    }

    const nextDays = 42 - days.length;
    for (let i = 1; i <= nextDays; i++) {
        days.push({ date: i, disabled: true, isToday: false });
    }

    return days;
};

export default Calendar;
