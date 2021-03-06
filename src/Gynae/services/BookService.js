import API from './api';
import axiosRetry from 'axios-retry';

export default class BookService {

   static changeDepositBooking = (bookingId, deposit) => {
      return API.post(`/api/gynae/book/changedepositbooking?id=${bookingId}&deposit=${deposit}`);
   }

   static addNewBooking = (payload) =>
   {
      return API.post(`/api/gynae/book/addnewbooking`, payload);
   }

   static sendRegFormEmail = (bookingId) =>
   {
      return API.post(`/api/gynae/book/sendregformemail?id=${bookingId}`);
   }

   static payBooking = (bookingId,price, paymentMethod, corporate) =>
   {
      return API.post(`/api/gynae/book/paybooking?id=${bookingId}&paymentmethod=${paymentMethod}&corporate=${corporate}&price=${price}`);
   }

   static unPayBooking = (bookingId) =>
   {
      return API.post(`/api/gynae/book/unpaybooking?id=${bookingId}`);
   }

   static getShouldRefundsCount = () =>
   {
      return API.get(`/api/gynae/book/getshouldrefundscount?`);
   }

   static manualRefundBooking = (bookingId) =>
   {
      return API.post(`/api/gynae/payment/manualrefundpayment`, {bookingId: bookingId});
   }

   static refundBooking = (bookingId) =>
   {
      return API.post(`/api/gynae/payment/refundpayment`, {bookingId: bookingId});
   }

   static getBookingsStatsByDateStr = (dateStr) =>
   {
      return API.get(`/api/gynae/book/getbookingsstatsbydatestr?date=${dateStr}`);
   }

   static getBookingsCountByDateStr = (dateStr) =>
   {
      return API.get(`/api/gynae/book/getbookingscountbydatestr?date=${dateStr}`);
   }

   static getAllBookingsCountAll = () =>
   {
      return API.get(`/api/gynae/book/getallbookingscountall`);
   }

   static getBookingsCountByDateStrandTime = (dateStr, time, source) =>
   {
      return API.get(`/api/gynae/book/getbookingscountbydatestrandtime?date=${dateStr}&time=${time}`, {cancelToken: source.token});
   }

   static getBookingsByDateStrandTime = (dateStr, time) =>
   {
      return API.get(`/api/gynae/book/getbookingsbydatestrandtime?date=${dateStr}&time=${time}`);
   }


   static getAllBookingsCountByDateStr = (dateStr) =>
   {
      return API.get(`/api/gynae/book/getallbookingscountbydatestr?date=${dateStr}`);
   }

   static getAllBookingsCountByDateStrandTime = (dateStr, time, source) =>
   {
      return API.get(`/api/gynae/book/getallbookingscountbydatestrandtime?date=${dateStr}&time=${time}`, {cancelToken: source.token});
   }

   static getAllBookingsByDateStrandTime = (dateStr, time) =>
   {
      return API.get(`/api/gynae/book/getallbookingsbydatestrandtime?date=${dateStr}&time=${time}`);
   }

   static changeBackToBookingMade = (id) =>
   {
      return API.post(`/api/gynae/book/changebacktobookingmade?id=${id}`);
   }

   static changeToPatientAttended = (id) =>
   {
      return API.post(`/api/gynae/book/changetopatientattended?id=${id}`);
   }

   static updateBooking = (payload) =>
   {
      return API.post(`/api/gynae/book/updatebookappointment`, payload);
   } 

   static updateBookingTime = (payload) =>
   {
      return API.post(`/api/gynae/book/updatebookappointmenttime`, payload);
   } 

   static deleteBooking = (id) =>
   {
      return API.post(`/api/gynae/book/deletebookappointment?id=${id}`);
   } 

   static unDeleteBooking = (id) =>
   {
      return API.post(`/api/gynae/book/undeletebookappointment?id=${id}`);
   } 
   
    static getBookingsByRef = (ref) =>
    {
       return API.get(`/api/gynae/book/getbookingsbyref?ref=${ref}`);
    }

    static getBookingById = (id) =>
    {
       return API.get(`/api/gynae/book/getbookingbyid?id=${id}`);
    }

    static getAllBookings = (limit) =>
    {
      if (!limit) limit = 25 
      return API.get(`/api/gynae/book/getallbookings?limit=${limit}`);
    }

    static getDeletedBookings= (limit) =>
    {
      if (!limit) limit = 25 
       return API.get(`/api/gynae/book/getdeletedbookings?limit=${limit}`);
    }

    static getTodayBookings= () =>
    {
       return API.get(`/api/gynae/book/gettodaybookings`);
    }

    static getOldBookings= (limit) =>
    {
      if (!limit) limit = 25 
       return API.get(`/api/gynae/book/getoldbookings?limit=${limit}`);
    }

    static getFutureBookings= (limit) =>
    {
      if (!limit) limit = 25 
       return API.get(`/api/gynae/book/getfuturebookings?limit=${limit}`);
    }

    static getRecentBookings= () =>
    {
       return API.get(`/api/gynae/book/getrecentbookings`);
    }

    static getRecentBookingsAll= (limit) =>
    {
      if (!limit) limit = 25 
       return API.get(`/api/gynae/book/getrecentbookingsall?limit=${limit}`);
    }
}