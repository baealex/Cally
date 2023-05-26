import classNames from 'classnames';
import { useMemo } from 'react';

import { createCalendarData } from './calendar.helper';

interface CalendarLineProp {
    year: number;
    month: number;
    dataInclude: string[];
    defaultColor: string;
    pointColor: string;
    backgroundColor: string;
    backgroundOpacity: string;
    onDateClick: (date: number) => void;
    onDateChange: (year: number, month: number) => void;
}

export const CalendarLine = ({
    year,
    month,
    dataInclude,
    defaultColor,
    pointColor,
    backgroundColor,
    backgroundOpacity,
    onDateClick,
    onDateChange
}: CalendarLineProp) => {
    const calendarData = useMemo(() => {
        return createCalendarData(year, month)
            .filter((week) => week.some((date) => date !== null));
    }, [year, month]);

    const handleClickPrevious = () => {
        if (month === 1) {
            onDateChange(year - 1, 12);
        } else {
            onDateChange(year, month - 1);
        }
    };

    const handleClickNext = () => {
        if (month === 12) {
            onDateChange(year + 1, 1);
        } else {
            onDateChange(year, month + 1);
        }
    };

    return (
        <>
            <div className="calendar">
                <div className="calendar-body">
                    <div className="calendar-body-body">
                        <button className="calendar-body-body-button-previous" onClick={handleClickPrevious}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="36"
                                height="36"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"><path d="M15 4l-8 8 8 8" /></svg>
                        </button>
                        <div className="calendar-body-body-month">
                            <h2>
                                <span className="calendar-body-body-month-year">{year}</span>
                                <span className="calendar-body-body-month-month">{month}</span>
                            </h2>
                        </div>
                        {calendarData.map((week) => week.map((date, index) => {
                            return (
                                <div
                                    key={index}
                                    className={classNames(
                                        'calendar-body-body-day',
                                        { 'null': date === null },
                                        { 'point': index === 0 },
                                        { 'include': dataInclude.includes(String(date)) }
                                    )}
                                    onClick={() => date !== null && onDateClick(date)}>
                                    <h3>{date}</h3>
                                </div>
                            );
                        }))}
                        <button className="calendar-body-body-button-next" onClick={handleClickNext}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="36"
                                height="36"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"><path d="M8 4l8 8-8 8" /></svg>
                        </button>
                    </div>
                </div>
            </div >
            <style jsx>{`
                .calendar {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    color: ${defaultColor};
                    user-select: none;
                }
                
                .calendar::before {
                    content: '';
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    z-index: -1;
                    top: 0;
                    left: 0;
                    background-color: ${backgroundColor};
                    opacity: ${backgroundOpacity};
                    border-radius: 10px;
                }

                .point {
                    color: ${pointColor};
                }

                .calendar-body {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .calendar-body-header-day {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .calendar-body-body-button-previous,
                .calendar-body-body-button-next {
                    width: 25px;
                    height: 25px;
                    border: none;
                    background-color: transparent;
                    cursor: pointer;
                    color: inherit;
                }

                .calendar-body-body-button-previous svg,
                .calendar-body-body-button-next svg {
                    width: 100%;
                    height: 100%;
                }

                .calendar-body-body-button-previous:hover,
                .calendar-body-body-button-next:hover {
                    opacity: 0.5;
                }

                .calendar-body-body-button-previous:active,
                .calendar-body-body-button-next:active {
                    opacity: 0.8;
                }

                .calendar-body-body-month {
                    margin: 0 8px;
                }

                .calendar-body-body-month h2 {
                    font-size: 0.8rem;
                    font-weight: bold;
                }

                .calendar-body-body-month-year {
                    margin-right: 4px;
                }

                .calendar-body-body-month-month {
                    font-size: 1.5rem;
                }

                .calendar-body-body {
                    display: flex;
                    align-items: center;
                }

                .calendar-body-body-day {
                    position: relative;
                    margin: 0 8px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    position: relative;
                }

                .calendar-body-body-day h3 {
                    font-size: 0.8rem;
                }


                .calendar-body-body-day.include::after {
                    content: '';
                    width: 3px;
                    height: 3px;
                    position: absolute;
                    z-index: -1;
                    bottom: 8px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: ${pointColor};
                    border-radius: 100%;
                }

                .calendar-body-body-day::before {
                    content: '';
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    z-index: -1;
                    top: 0;
                    left: 0;
                    background-color: ${pointColor};
                    filter: blur(10px);
                    opacity: 0;
                    border-radius: 10px;
                }

                .calendar-body-body-day:hover::before {
                    opacity: 0.3;
                }

                .calendar-body-body-day:active::before {
                    opacity: 0.5;
                }

                .calendar-body-body-day.null {
                    display: none;
                }

                .calendar-body-body-day:focus {
                    outline: none;
                }
            `}</style>
        </>
    );
};