import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://crm-backend-freelance-project.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  }, 
});

export default axiosInstance;

// http://localhost:5000
// https://fts-server-indol.vercel.app
//axiospage