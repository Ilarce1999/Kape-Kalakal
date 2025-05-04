// utils/customFetch.js
import axios from 'axios';

const customFetch = axios.create({
  baseURL: '/api/v1',  // This should match your server's base API URL
  withCredentials: true, // This ensures that cookies are sent with the request (for auth)

});

export default customFetch;