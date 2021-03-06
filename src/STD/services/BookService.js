import API from './api';
import axiosRetry from 'axios-retry';

export default class BookService {


   static addNewBooking = (payload) =>
   {
      return API.post(`/api/std/book/addnewbooking`, payload);
   }
   
   static sendRegFormEmail = (bookingId) =>
   {
      return API.post(`/api/std/book/sendregformemail?id=${bookingId}`);
   }
   static payBooking = (bookingId,price, paymentMethod, corporate) =>
   {
      return API.post(`/api/std/book/paybooking?id=${bookingId}&paymentmethod=${paymentMethod}&corporate=${corporate}&price=${price}`);
   }

   static unPayBooking = (bookingId) =>
   {
      return API.post(`/api/std/book/unpaybooking?id=${bookingId}`);
   }

   static getShouldRefundsCount = () =>
   {
      return API.get(`/api/std/book/getshouldrefundscount?`);
   }

   

   static refundBooking = (bookingId) =>
   {
      return API.post(`/api/std/payment/refundpayment`, {bookingId: bookingId});
   }

   static getBookingsStatsByDateStr = (dateStr) =>
   {
      return API.get(`/api/std/book/getbookingsstatsbydatestr?date=${dateStr}`);
   }

   static getBookingsCountByDateStr = (dateStr) =>
   {
      return API.get(`/api/std/book/getbookingscountbydatestr?date=${dateStr}`);
   }

   static getAllBookingsCountAll = () =>
   {
      return API.get(`/api/std/book/getallbookingscountall`);
   }

   static getBookingsCountByDateStrandTime = (dateStr, time, source) =>
   {
      return API.get(`/api/std/book/getbookingscountbydatestrandtime?date=${dateStr}&time=${time}`, {cancelToken: source.token});
   }

   static getBookingsByDateStrandTime = (dateStr, time) =>
   {
      return API.get(`/api/std/book/getbookingsbydatestrandtime?date=${dateStr}&time=${time}`);
   }


   static getAllBookingsCountByDateStr = (dateStr) =>
   {
      return API.get(`/api/std/book/getallbookingscountbydatestr?date=${dateStr}`);
   }

   static getAllBookingsCountByDateStrandTime = (dateStr, time, source) =>
   {
      return API.get(`/api/std/book/getallbookingscountbydatestrandtime?date=${dateStr}&time=${time}`, {cancelToken: source.token});
   }

   static getAllBookingsByDateStrandTime = (dateStr, time) =>
   {
      return API.get(`/api/std/book/getallbookingsbydatestrandtime?date=${dateStr}&time=${time}`);
   }

   static changeBackToBookingMade = (id) =>
   {
      return API.post(`/api/std/book/changebacktobookingmade?id=${id}`);
   }

   static changeToPatientAttended = (id) =>
   {
      return API.post(`/api/std/book/changetopatientattended?id=${id}`);
   }

   static updateBooking = (payload) =>
   {
      return API.post(`/api/std/book/updatebookappointment`, payload);
   } 

   static updateBookingTime = (payload) =>
   {
      return API.post(`/api/std/book/updatebookappointmenttime`, payload);
   } 

   static deleteBooking = (id) =>
   {
      return API.post(`/api/std/book/deletebookappointment?id=${id}`);
   } 

   static unDeleteBooking = (id) =>
   {
      return API.post(`/api/std/book/undeletebookappointment?id=${id}`);
   } 
   
    static getBookingsByRef = (ref) =>
    {
       return API.get(`/api/std/book/getbookingsbyref?ref=${ref}`);
    }

    static getBookingById = (id) =>
    {
       return API.get(`/api/std/book/getbookingbyid?id=${id}`);
    }

    static getAllBookings = (limit) =>
    {
      if (!limit) limit = 25 
      return API.get(`/api/std/book/getallbookings?limit=${limit}`);
    }

    static getDeletedBookings= (limit) =>
    {
      if (!limit) limit = 25 
       return API.get(`/api/std/book/getdeletedbookings?limit=${limit}`);
    }

    static getTodayBookings= () =>
    {
       return API.get(`/api/std/book/gettodaybookings`);
    }

    static getOldBookings= (limit) =>
    {
      if (!limit) limit = 25 
       return API.get(`/api/std/book/getoldbookings?limit=${limit}`);
    }

    static getFutureBookings= (limit) =>
    {
      if (!limit) limit = 25 
       return API.get(`/api/std/book/getfuturebookings?limit=${limit}`);
    }

    static getRecentBookings= () =>
    {
       return API.get(`/api/std/book/getrecentbookings`);
    }

    static getRecentBookingsAll= (limit) =>
    {
      if (!limit) limit = 25 
       return API.get(`/api/std/book/getrecentbookingsall?limit=${limit}`);
    }
}