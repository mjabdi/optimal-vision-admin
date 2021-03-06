import calendar from 'node-calendar';


export default class CalendarUtil {

    static getMonthRange = (month , year) =>
    {
        return new calendar.Calendar(calendar.SUNDAY).itermonthdates(year, month);
    } 

} 