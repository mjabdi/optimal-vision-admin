
import API from './api';

export default class TimeService{

     static getFirstAvailableDate =  () =>
    {
        return API.get('/api/time/getfirstavaiabledate');
    }

    // static dayIsBooked =  (date) =>
    // {
    //    /// check if this date is booked or not
    //    return new Promise( (resolve, reject) =>
    //    {
    //         setTimeout(() => {
    //             resolve(false);
    //         }, 1000);
    //    });
    // }

    static getFullyBookedDates = () =>
    {        
       return API.get('/api/time/getfullybookeddays');
    }

    static getTimeSlots = (date) =>
    {
        return API.get(`/api/time/gettimeslots?date=${date}`);
    }


}