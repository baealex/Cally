import { useMemo } from "react"

const createCalendarData = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
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
    onDateClick: (date: number) => void
    onDateChange: (year: number, month: number) => void
}

export const Calendar = ({
    year,
    month,
    onDateClick,
    onDateChange
}: CalendarProp) => {
    const calendarData = useMemo(() => {
        return createCalendarData(year, month)
            .filter((week) => week.some((date) => date !== null))
    }, [year, month]) 

    const handleClickPrevious = () => {
        if (month === 0) {
            onDateChange(year - 1, 11)
        } else {
            onDateChange(year, month - 1)
        }
    }

    const handleClickNext = () => {
        if (month === 11) {
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4l-8 8 8 8"/></svg>
                        </button>
                        <div className="calendar-header-center">
                            <h2>{year} / {month + 1}</h2>
                        </div>
                        <button className="calendar-header-button-next" onClick={handleClickNext}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4l8 8-8 8"/></svg>
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
                                <div className={`calendar-body-body-day ${date === null ? 'null' : index === 0 ? 'point' : ''}`} key={index}>
                                    <h3>{date}</h3>
                                </div>
                            )
                        }))}
                    </div>
                </div>
            </div>
            <style jsx>{`
                .calendar {
                    border-radius: 10px;
                    display: flex;
                    flex-direction: column;
                    color:#543;
                    user-select: none;
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
                    padding: 0 20px;
                }
                .calendar-body-body-day {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 10px;
                    cursor: pointer;
                }
                .calendar-body-body-day:hover {
                    background-color: #f2f2f2;
                }
                .calendar-body-body-day:active {
                    background-color: #e6e6e6;
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
                .calendar-body-body-day:hover {
                    background-color: #f2f2f2;
                }
                .calendar-body-body-day:active {
                    background-color: #e6e6e6;
                }
                .calendar-body-body-day:focus {
                    outline: none;
                }
                .point {
                    color: #ee0000;
                }
            `}</style>
        </>
    )
}