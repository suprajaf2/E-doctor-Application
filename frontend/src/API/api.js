/// src/API/api.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Ensure this URL matches your backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
