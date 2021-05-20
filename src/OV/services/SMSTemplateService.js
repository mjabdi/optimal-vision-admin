import API from './api';
import axiosRetry from 'axios-retry';

export default class TemplateService {

   static getSMSPreview = (templateId, bookingId, patientId) =>
   {
      return API.post(`/api/optimalvision/smstemplate/getsmspreview`, {templateId,bookingId,patientId});
   }

   static sendManualSMS = (templateId, sendTo, bookingId, patientId) =>
   {
      return API.post(`/api/optimalvision/smstemplate/sendmanualsms`, {templateId,sendTo,bookingId,patientId});
   }

   static registerNewTemplate = (payload) =>
   {
      return API.post(`/api/optimalvision/smstemplate/registernewtemplate`, payload);
   }

   static updateTemplate = (payload) =>
   {
      return API.post(`/api/optimalvision/smstemplate/updatetemplate`, payload);
   } 

   static deleteTemplate = (id) =>
   {
      return API.post(`/api/optimalvision/smstemplate/deletetemplate?id=${id}`);
   } 

    static getTemplateById = (id) =>
    {
       return API.get(`/api/optimalvision/smstemplate/gettemplatebyid?id=${id}`);
    }

    static getTemplateBytemplateId = (templateID) =>
    {
       return API.get(`/api/optimalvision/smstemplate/gettemplatebytemplateid?templateID=${templateID}`);
    }

    static getAllTemplates = () =>
    {
      return API.get(`/api/optimalvision/smstemplate/getalltemplates`);
    }
}