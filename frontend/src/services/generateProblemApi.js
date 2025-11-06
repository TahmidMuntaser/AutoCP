import axios from 'axios';

const API_URL = 'http://localhost:3000/api/generate-problem';

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

// Generate a new problem
export const generateProblem = async (problemData) => {
  try {
    const response = await api.post('', problemData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to generate problem' };
  }
};

// Get problem history
export const getProblemHistory = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/history', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch problem history' };
  }
};

// Get favorite problems
export const getFavoriteProblems = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/favorites', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch favorite problems' };
  }
};

// Get single problem by ID
export const getProblemById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch problem' };
  }
};

// Toggle favorite status
export const toggleFavorite = async (id) => {
  try {
    const response = await api.put(`/${id}/favorite`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update favorite status' };
  }
};

// Delete problem
export const deleteProblem = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete problem' };
  }
};

export default {
  generateProblem,
  getProblemHistory,
  getFavoriteProblems,
  getProblemById,
  toggleFavorite,
  deleteProblem
};
