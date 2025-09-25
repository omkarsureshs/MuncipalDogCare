// src/services/api.js
import axios from 'axios';


const API_BASE_URL = 'http://10.0.2.2:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Mock API functions for testing (remove when backend is ready)
export const complaintsAPI = {
  getAll: async () => {
    // Mock data for testing
    return {
      data: [
        {
          id: 1,
          category: 'GARBAGE',
          description: 'Garbage pile near the park entrance',
          status: 'PENDING',
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          category: 'DOG',
          description: 'Stray dogs causing nuisance in the neighborhood',
          status: 'IN_PROGRESS',
          created_at: new Date().toISOString(),
        }
      ]
    };
  },
};

export default api;