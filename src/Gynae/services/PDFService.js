import API from './api';

export default class PDFService {


    static downloadGynaeRegForm = (id) =>
    {
       return API.get(`/api/pdf/downloadgynaeregform?id=${id}`, {
        responseType: 'arraybuffer',
        id: id,
        headers: {
            Accept: 'application/pdf',
        }
        });
    }


    static downloadCovidForm1 = (id) =>
    {
       return API.get(`/api/pdf/downloadcovidform1?id=${id}`, {
        responseType: 'arraybuffer',
        id: id,
        headers: {
            Accept: 'application/pdf',
        }
        });
    }

    static downloadCovidForm2 = (id) =>
    {
       return API.get(`/api/pdf/downloadcovidform2?id=${id}`, {
        responseType: 'arraybuffer',
        headers: {
            Accept: 'application/pdf',
        }
        });
    }

    static downloadPdfResult = (id) =>
    {
       return API.get(`/api/pdf/downloadpdfresult?id=${id}`, {
        responseType: 'arraybuffer',
        headers: {
            Accept: 'application/pdf',
        }
        });
    }

    static downloadPdfCert = (id) =>
    {
       return API.get(`/api/pdf/downloadpdfcert?id=${id}`, {
        responseType: 'arraybuffer',
        headers: {
            Accept: 'application/pdf',
        }
        });
    }

    static downloadPdfLabReport = (id) =>
    {
       return API.get(`/api/pdf/downloadpdflabreport?id=${id}`, {
        responseType: 'arraybuffer',
        headers: {
            Accept: 'application/pdf',
        }
        });
    }


}