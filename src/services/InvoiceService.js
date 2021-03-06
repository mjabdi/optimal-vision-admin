import API from './api';

export default class InvoiceService{

    static createInvoice = (payload) =>
    {
        return  API.post('/api/medex/invoice/createinvoice', payload)
    }

    static updateInvoice = (invoiceNumber, payload) =>
    {
        return  API.post(`/api/medex/invoice/updateinvoice?invoiceNumber=${invoiceNumber}`, payload)
    }

    static deleteinvoice = (invoiceNumber) =>
    {
        return  API.post(`/api/medex/invoice/deleteinvoice?invoiceNumber=${invoiceNumber}`)
    }

    static getInvoiceByBookingId = (bookingId) =>
    {
        return  API.get(`/api/medex/invoice/getinvoicebybookingid?bookingId=${bookingId}`)
    }

    static getInvoiceByInvoiceNumber = (invoiceNumber) =>
    {
        return  API.get(`/api/medex/invoice/getinvoicebyinvoicenumber?invoiceNumber=${invoiceNumber}`)
    }

    static getCodeDetails = (code) =>
    {
        return  API.post(`/api/medex/invoice/getcodedetails`, {code: code})
    }

    static getAllCodes = () =>
    {
        return API.get(`/api/medex/invoice/getallcodes`)
    }

    static downloadInvoice = (id) =>
    {
       return API.get(`/api/pdf/downloadinvoice?id=${id}`, {
        responseType: 'arraybuffer',
        id: id,
        headers: {
            Accept: 'application/pdf',
        }
        });
    }

    static emailInvoice = (id, email) =>
    {
       return API.post(`/api/pdf/emailinvoice?id=${id}&email=${email}`);
    }

}
