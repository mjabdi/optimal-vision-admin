import axios from 'axios';
import { authToken, backendAPI } from '../GlobalPath';

export default axios.create({
  baseURL: backendAPI,

  headers : {
      'Authorization' : authToken
  }
});