import API from './api';
import axiosRetry from 'axios-retry';

export default class BookService {


   static payBooking = (bookingId, paymentMethod, corporate) =>
   {
      return API.post(`/api/book/paybooking?id=${bookingId}&paymentmethod=${paymentMethod}&corporate=${corporate}`);
   }

   static unPayBooking = (bookingId) =>
   {
      return API.post(`/api/book/unpaybooking?id=${bookingId}`);
   }

   static getTestsTimeReport = () =>
   {
      axiosRetry( API, { retries: 3,  retryDelay: (retryCount) => {
         return retryCount * 1000;
       } });
      return API.get(`/api/book/getteststimereport`);
   }

   static getBookingsStatsByDateStr = (dateStr) =>
   {
      return API.get(`/api/book/getbookingsstatsbydatestr?date=${dateStr}`);
   }

   static getBookingsCountByDateStr = (dateStr) =>
   {
      return API.get(`/api/book/getbookingscountbydatestr?date=${dateStr}`);
   }

   static getAllBookingsCountAll = () =>
   {
      return API.get(`/api/book/getallbookingscountall`);
   }

   static getBookingsCountByDateStrandTime = (dateStr, time, source) =>
   {
      return API.get(`/api/book/getbookingscountbydatestrandtime?date=${dateStr}&time=${time}`, {cancelToken: source.token});
   }

   static getBookingsByDateStrandTime = (dateStr, time) =>
   {
      return API.get(`/api/book/getbookingsbydatestrandtime?date=${dateStr}&time=${time}`);
   }


   static getAllBookingsCountByDateStr = (dateStr) =>
   {
      return API.get(`/api/book/getallbookingscountbydatestr?date=${dateStr}`);
   }

   static getAllBookingsCountByDateStrandTime = (dateStr, time, source) =>
   {
      return API.get(`/api/book/getallbookingscountbydatestrandtime?date=${dateStr}&time=${time}`, {cancelToken: source.token});
   }

   static getAllBookingsByDateStrandTime = (dateStr, time) =>
   {
      return API.get(`/api/book/getallbookingsbydatestrandtime?date=${dateStr}&time=${time}`);
   }




   static changeBackToBookingMade = (id) =>
   {
      return API.post(`/api/book/changebacktobookingmade?id=${id}`);
   }

   static resendEmailsWithBookingId = (bookingId) =>
   {
      return API.post(`/api/book/resendemailswithbookingid?id=${bookingId}`);
   }

   static regenerateFilesWithBookingId  = (bookingId) =>
   {
      return API.post(`/api/book/regeneratefileswithbookingid?id=${bookingId}`);
   }


   static resendEmails  = (linkId) =>
   {
      return API.post(`/api/book/resendemails?id=${linkId}`);
   }

   static regenerateFiles  = (linkId) =>
   {
      return API.post(`/api/book/regeneratefiles?id=${linkId}`);
   }

   static matchRecords  = (bookingId, linkId) =>
   {
      return API.post(`/api/book/matchrecords?bookingid=${bookingId}&linkid=${linkId}`);
   }

   static findBestMatches = (id) =>
   {
      return API.get(`/api/book/getbestmatchedbookings?id=${id}`);
   } 

   static getLinkDetails = (id) =>
   {
      return API.get(`/api/book/getlinkdetails?id=${id}`);
   } 

   static getLinkDetailsWithBookingId = (id) =>
   {
      return API.get(`/api/book/getlinkdetailswithbookingid?id=${id}`);
   } 



   static findBookingByRefBirthDate = (bookingRef, birthDate) =>
   {
      return API.get(`/api/book/getbookingsbyrefandbirthdate?ref=${bookingRef}&birthdate=${birthDate}`);
   }

   static updateBooking = (payload) =>
   {
      return API.post(`/api/book/updatebookappointment`, payload);
   } 

   static updateBookingTime = (payload) =>
   {
      return API.post(`/api/book/updatebookappointmenttime`, payload);
   } 

   static deleteBooking = (id) =>
   {
      return API.post(`/api/book/deletebookappointment?id=${id}`);
   } 

   static unDeleteBooking = (id) =>
   {
      return API.post(`/api/book/undeletebookappointment?id=${id}`);
   } 
   
   
    static getBookingsByRef = (ref) =>
    {
       return API.get(`/api/book/getbookingsbyref?ref=${ref}`);
    }

    static getBookingById = (id) =>
    {
       return API.get(`/api/book/getbookingbyid?id=${id}`);
    }

    static getAllBookings = (limit) =>
    {
      if (!limit) limit = 25 
      return API.get(`/api/book/getallbookings?limit=${limit}`);
    }

    static getAllTRBookings = (limit) =>
    {
      if (!limit) limit = 25 
      return API.get(`/api/book/getalltrbookings?limit=${limit}`);
    }

    static getLateBookings= () =>
    {
       return API.get(`/api/book/getlatebookings`);
    }

    static getDeletedBookings= (limit) =>
    {
      if (!limit) limit = 25 
       return API.get(`/api/book/getdeletedbookings?limit=${limit}`);
    }

    static getLiveBookings= () =>
    {
       return API.get(`/api/book/getlivebookings`);
    }

    static getCompletedBookings= (limit) =>
    {
      if (!limit) limit = 25 
       return API.get(`/api/book/getcompletedbookings?limit=${limit}`);
    }

    static getPositiveBookings= () =>
    {
       return API.get(`/api/book/getpositivebookings`);
    }



    static getTodayBookings= () =>
    {
       return API.get(`/api/book/gettodaybookings`);
    }

    static getOldBookings= (limit) =>
    {
      if (!limit) limit = 25 
       return API.get(`/api/book/getoldbookings?limit=${limit}`);
    }

    static getFutureBookings= (limit) =>
    {
      if (!limit) limit = 25 
       return API.get(`/api/book/getfuturebookings?limit=${limit}`);
    }

    static getRecentBookings= () =>
    {
       return API.get(`/api/book/getrecentbookings`);
    }

    static getRecentBookingsAll= (limit) =>
    {
      if (!limit) limit = 25 
       return API.get(`/api/book/getrecentbookingsall?limit=${limit}`);
    }

    static getUnmatchedRecords= () =>
    {
       return API.get(`/api/book/getunmatchedrecords`);
    }

    static getUnmatchedRecordsArchived= () =>
    {
       return API.get(`/api/book/getunmatchedrecordsarchived`);
    }

    static archiveRecord = (id) =>
    {
       return API.post(`/api/book/archiverecord?id=${id}`);
    }

    static unArchiveRecord = (id) =>
    {
       return API.post(`/api/book/unarchiverecord?id=${id}`);
    }


}