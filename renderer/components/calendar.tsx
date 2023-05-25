import { useMemo } from "react"
import classNames from 'classnames'

const createCalendarData = (year: number, month: number) => {
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const firstDayOfWeek = firstDay.getDay()
    const lastDayOfWeek = lastDay.getDay()
    const firstDate = firstDay.getDate()
    const lastDate = lastDay.getDate()

    const calendarData = []

    let date = firstDate
    for (let i = 0; i < 6; i++) {
        const week = []
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDayOfWeek) {
                week.push(null)
            } else if (i === 5 && j > lastDayOfWeek) {
                week.push(null)
            } else if (date > lastDate) {
                week.push(null)
            } else {
                week.push(date)
                date++
            }
        }
        calendarData.push(week)
    }
    return calendarData
}

const WEEK = [
    'Sun',
    'Mon',
    'Tue',
    'Web',
    'Thu',
    'Fri',
    'Sat'
]

interface CalendarProp {
    year: number
    month: number
    dataInclude: string[]
    defaultColor: string
    pointColor: string
    backgroundColor: string
    backgroundOpacity: string
    onDateClick: (date: number) => void
    onDateChange: (year: number, month: number) => void
}

export const Calendar = ({
    year,
    month,
    dataInclude,
    defaultColor,
    pointColor,
    backgroundColor,
    backgroundOpacity,
    onDateClick,
    onDateChange
}: CalendarProp) => {
    const calendarData = useMemo(() => {
        return createCalendarData(year, month)
            .filter((week) => week.some((date) => date !== null))
    }, [year, month])

    const handleClickPrevious = () => {
        if (month === 1) {
            onDateChange(year - 1, 11)
        } else {
            onDateChange(year, month - 1)
        }
    }

    const handleClickNext = () => {
        if (month === 12) {
            onDateChange(year + 1, 0)
        } else {
            onDateChange(year, month + 1)
        }
    }

    return (
        <>
            <div className="calendar">
                <div className="calendar-header">
                    <button className="calendar-header-button-previous" onClick={handleClickPrevious}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4l-8 8 8 8" /></svg>
                    </button>
                    <div className="calendar-header-center">
                        <h2>{year} / {month}</h2>
                    </div>
                    <button className="calendar-header-button-next" onClick={handleClickNext}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4l8 8-8 8" /></svg>
                    </button>
                </div>
                <div className="calendar-body">
                    <div className="calendar-body-header">
                        {WEEK.map((day) => (
                            <div className={`calendar-body-header-day ${day === 'Sun' ? 'point' : ''}`} key={day}>
                                <h3>{day}</h3>
                            </div>
                        ))}
                    </div>
                    <div className="calendar-body-body">
                        {calendarData.map((week) => week.map((date, index) => {
                            return (
                                <div
                                    key={index}
                                    className={classNames(
                                        `calendar-body-body-day`,
                                        { 'null': date === null },
                                        { 'point': index === 0 },
                                        { 'include': dataInclude.includes(String(date)) }
                                    )}
                                    onClick={() => date !== null && onDateClick(date)}
                                >
                                    <h3>{date}</h3>
                                </div>
                            )
                        }))}
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

                .calendar-header {
                    width: 100%;
                    height: 10%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 20px;
                }

                .calendar-body {
                    width: 100%;
                    height: 90%;
                    display: flex;
                    flex-direction: column;
                }

                .calendar-body-header {
                    width: 100%;
                    height: 10%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 20px;
                }

                .calendar-body-header-day {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .calendar-header-button-previous,
                .calendar-header-button-next {
                    width: 30px;
                    height: 30px;
                    border: none;
                    background-color: transparent;
                    cursor: pointer;
                    color: inherit;
                }

                .calendar-header-button-previous svg,
                .calendar-header-button-next svg {
                    width: 100%;
                    height: 100%;
                }

                .calendar-header-button-previous:hover,
                .calendar-header-button-next:hover {
                    opacity: 0.5;
                }

                .calendar-header-button-previous:active,
                .calendar-header-button-next:active {
                    opacity: 0.8;
                }

                .calendar-header-center {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .calendar-body-header-day h3 {
                    font-size: 1.2rem;
                    font-weight: 500;
                }

                .calendar-body-body {
                    width: 100%;
                    height: 90%;
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    grid-template-rows: repeat(5, 1fr);
                    grid-row-gap: 8px;
                    grid-column-gap: 16px;
                    padding: 0 20px 20px;
                }

                .calendar-body-body-day {
                    position: relative;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    position: relative;
                }

                .calendar-body-body-day.include::after {
                    content: '';
                    width: 4px;
                    height: 4px;
                    position: absolute;
                    z-index: -1;
                    bottom: 4px;
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
                    cursor: default;
                    pointer-events: none;
                }

                .calendar-body-body-day:focus {
                    outline: none;
                }

                .calendar-body-body-day h3 {
                    font-size: 1.2rem;
                    font-weight: 500;
                }
            `}</style>
        </>
    )
}