// utils/customFetch.js
import axios from 'axios';

const customFetch = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // Required to send cookies
});

export default customFetch;