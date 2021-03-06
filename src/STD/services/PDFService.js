import API from './api';

export default class PDFService {


    static downloadSTDRegForm = (id) =>
    {
       return API.get(`/api/pdf/downloadstdregform?id=${id}`, {
        responseType: 'arraybuffer',
        id: id,
        headers: {
            Accept: 'application/pdf',
        }
        });
    }

}