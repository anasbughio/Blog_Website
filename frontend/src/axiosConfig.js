import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const instance = axios.create({
    baseURL :API_URL,
      withCredentials: true // ✅ send and receive cookies
});

export default instance;