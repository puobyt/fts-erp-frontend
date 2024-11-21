import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://fts-server-alpha.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;