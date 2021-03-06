import API from './api';

export default class PDFService {


    static downloadGPRegForm = (id) =>
    {
       return API.get(`/api/pdf/downloadgpregform?id=${id}`, {
        responseType: 'arraybuffer',
        id: id,
        headers: {
            Accept: 'application/pdf',
        }
        });
    }



}