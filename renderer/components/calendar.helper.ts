export const createCalendarData = (year: number, month: number) => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const firstDayOfWeek = firstDay.getDay();
    const lastDayOfWeek = lastDay.getDay();
    const firstDate = firstDay.getDate();
    const lastDate = lastDay.getDate();

    const calendarData = [];

    let date = firstDate;
    for (let i = 0; i < 6; i++) {
        const week = [];
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDayOfWeek) {
                week.push(null);
            } else if (i === 5 && j > lastDayOfWeek) {
                week.push(null);
            } else if (date > lastDate) {
                week.push(null);
            } else {
                week.push(date);
                date++;
            }
        }
        calendarData.push(week);
    }
    return calendarData;
};

export const printMonthEn = (month: number) => {
    switch (month) {
        case 1:
            return 'January';
        case 2:
            return 'Febuary';
        case 3:
            return 'March';
        case 4:
            return 'April';
        case 5:
            return 'May';
        case 6:
            return 'June';
        case 7:
            return 'July';
        case 8:
            return 'Auguest';
        case 9:
            return 'September';
        case 10:
            return 'October';
        case 11:
            return 'November';
        case 12:
            return 'December';
    }
};