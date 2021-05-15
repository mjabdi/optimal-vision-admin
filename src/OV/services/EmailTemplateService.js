import API from './api';
import axiosRetry from 'axios-retry';

export default class TemplateService {


   static registerNewTemplate = (payload) =>
   {
      return API.post(`/api/optimalvision/emailtemplate/registernewtemplate`, payload);
   }

   static updateTemplate = (payload) =>
   {
      return API.post(`/api/optimalvision/emailtemplate/updatetemplate`, payload);
   } 

   static deleteTemplate = (id) =>
   {
      return API.post(`/api/optimalvision/emailtemplate/deletetemplate?id=${id}`);
   } 

    static getTemplateById = (id) =>
    {
       return API.get(`/api/optimalvision/emailtemplate/gettemplatebyid?id=${id}`);
    }

    static getTemplateBytemplateId = (templateID) =>
    {
       return API.get(`/api/optimalvision/emailtemplate/gettemplatebytemplateid?templateID=${templateID}`);
    }

    static getAllTemplates = () =>
    {
      return API.get(`/api/optimalvision/emailtemplate/getalltemplates`);
    }
}