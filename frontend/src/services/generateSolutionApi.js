import axios from 'axios';

const API_URL = 'http://localhost:3000/api/generate-solution';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Generate solution for a problem
export const generateSolution = async (problemId) => {
  try {
    const response = await api.post(`/${problemId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to generate solution' };
  }
};

// Get solution for a problem
export const getSolution = async (problemId) => {
  try {
    const response = await api.get(`/${problemId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch solution' };
  }
};

// Delete solution
export const deleteSolution = async (problemId) => {
  try {
    const response = await api.delete(`/${problemId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete solution' };
  }
};

export default {
  generateSolution,
  getSolution,
  deleteSolution
};
