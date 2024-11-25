import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;

// http://localhost:5000
// https://fts-server-indol.vercel.app