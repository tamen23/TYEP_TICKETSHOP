import axios from 'axios';

const apiInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export default apiInstance;

export const ApiService = {
  register(userData) {
    return apiInstance.post('/auth/register', userData);
  },

};
