import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://erp-api.fruition.in.net',
  headers: {
    'Content-Type': 'application/json',
  }, 
});

export default axiosInstance;

// http://localhost:5000
//   baseURL: 'https://fts-erp-backend.onrender.com',
//axiospage