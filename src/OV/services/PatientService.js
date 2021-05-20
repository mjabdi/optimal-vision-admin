import API from './api';
import axiosRetry from 'axios-retry';

export default class PatientService {

   static getNewPatientID = () =>
   {
      return API.get(`/api/optimalvision/patient/getnewpatientid`);
   }

   static registerNewPatient = (payload) =>
   {
      return API.post(`/api/optimalvision/patient/registernewpatient`, payload);
   }

   static updatePatient = (payload) =>
   {
      return API.post(`/api/optimalvision/patient/updatepatient`, payload);
   } 

   static deletePatient = (id) =>
   {
      return API.post(`/api/optimalvision/patient/deletepatient?id=${id}`);
   } 

   static unDeletePatient = (id) =>
   {
      return API.post(`/api/optimalvision/patient/undeletepatient?id=${id}`);
   } 
   
    static getPatientById = (id) =>
    {
       return API.get(`/api/optimalvision/patient/getpatientbyid?id=${id}`);
    }

    static getPatientByPatientId = (patientID) =>
    {
       return API.get(`/api/optimalvision/patient/getpatientbypatientid?patientID=${patientID}`);
    }

    static getPatientByEmail = (email) =>
    {
       return API.get(`/api/optimalvision/patient/getpatientbyemail?email=${email}`);
    }


    static getAllPatients = () =>
    {
      return API.get(`/api/optimalvision/patient/getallpatients`);
    }

    static getDeletedPatients= (limit) =>
    {
      if (!limit) limit = 25 
       return API.get(`/api/optimalvision/patiant/getdeletedpatients`);
    }

}