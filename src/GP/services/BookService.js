import API from './api';
import axiosRetry from 'axios-retry';

export default class BookService {


   static addNewBooking = (payload) =>
   {
      return API.post(`/api/gp/book/addnewbooking`, payload);
   }


   static sendRegFormEmail = (bookingId) =>
   {
      return API.post(`/api/gp/book/sendregformemail?id=${bookingId}`);
   }
   static payBooking = (bookingId,price, paymentMethod, corporate) =>
   {
      return API.post(`/api/gp/book/paybooking?id=${bookingId}&paymentmethod=${paymentMethod}&corporate=${corporate}&price=${price}`);
   }

   static unPayBooking = (bookingId) =>
   {
      return API.post(`/api/gp/book/unpaybooking?id=${bookingId}`);
   }

   static getShouldRefundsCount = () =>
   {
      return API.get(`/api/gp/book/getshouldrefundscount?`);
   }

   

   static refundBooking = (bookingId) =>
   {
      return API.post(`/api/gp/payment/refundpayment`, {bookingId: bookingId});
   }

   static getBookingsStatsByDateStr = (dateStr) =>
   {
      return API.get(`/api/gp/book/getbookingsstatsbydatestr?date=${dateStr}`);
   }

   static getBookingsCountByDateStr = (dateStr) =>
   {
      return API.get(`/api/gp/book/getbookingscountbydatestr?date=${dateStr}`);
   }

   static getAllBookingsCountAll = () =>
   {
      return API.get(`/api/gp/book/getallbookingscountall`);
   }

   static getBookingsCountByDateStrandTime = (dateStr, time, source) =>
   {
      return API.get(`/api/gp/book/getbookingscountbydatestrandtime?date=${dateStr}&time=${time}`, {cancelToken: source.token});
   }

   static getBookingsByDateStrandTime = (dateStr, time) =>
   {
      return API.get(`/api/gp/book/getbookingsbydatestrandtime?date=${dateStr}&time=${time}`);
   }


   static getAllBookingsCountByDateStr = (dateStr) =>
   {
      return API.get(`/api/gp/book/getallbookingscountbydatestr?date=${dateStr}`);
   }

   static getAllBookingsCountByDateStrandTime = (dateStr, time, source) =>
   {
      return API.get(`/api/gp/book/getallbookingscountbydatestrandtime?date=${dateStr}&time=${time}`, {cancelToken: source.token});
   }

   static getAllBookingsByDateStrandTime = (dateStr, time) =>
   {
      return API.get(`/api/gp/book/getallbookingsbydatestrandtime?date=${dateStr}&time=${time}`);
   }

   static changeBackToBookingMade = (id) =>
   {
      return API.post(`/api/gp/book/changebacktobookingmade?id=${id}`);
   }

   static changeToPatientAttended = (id) =>
   {
      return API.post(`/api/gp/book/changetopatientattended?id=${id}`);
   }

   static updateBooking = (payload) =>
   {
      return API.post(`/api/gp/book/updatebookappointment`, payload);
   } 

   static updateBookingTime = (payload) =>
   {
      return API.post(`/api/gp/book/updatebookappointmenttime`, payload);
   } 

   static deleteBooking = (id) =>
   {
      return API.post(`/api/gp/book/deletebookappointment?id=${id}`);
   } 

   static unDeleteBooking = (id) =>
   {
      return API.post(`/api/gp/book/undeletebookappointment?id=${id}`);
   } 
   
    static getBookingsByRef = (ref) =>
    {
       return API.get(`/api/gp/book/getbookingsbyref?ref=${ref}`);
    }

    static getBookingById = (id) =>
    {
       return API.get(`/api/gp/book/getbookingbyid?id=${id}`);
    }

    static getAllBookings = (limit) =>
    {
      if (!limit) limit = 25 
      return API.get(`/api/gp/book/getallbookings?limit=${limit}`);
    }

    static getDeletedBookings= (limit) =>
    {
      if (!limit) limit = 25 
       return API.get(`/api/gp/book/getdeletedbookings?limit=${limit}`);
    }

    static getTodayBookings= () =>
    {
       return API.get(`/api/gp/book/gettodaybookings`);
    }

    static getOldBookings= (limit) =>
    {
      if (!limit) limit = 25 
       return API.get(`/api/gp/book/getoldbookings?limit=${limit}`);
    }

    static getFutureBookings= (limit) =>
    {
      if (!limit) limit = 25 
       return API.get(`/api/gp/book/getfuturebookings?limit=${limit}`);
    }

    static getRecentBookings= () =>
    {
       return API.get(`/api/gp/book/getrecentbookings`);
    }

    static getRecentBookingsAll= (limit) =>
    {
      if (!limit) limit = 25 
       return API.get(`/api/gp/book/getrecentbookingsall?limit=${limit}`);
    }
}