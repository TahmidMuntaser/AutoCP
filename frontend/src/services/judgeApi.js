import axios from 'axios';

const API_URL = 'http://localhost:3000/api/judge';

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

// Submit solution
export const submitSolution = async (problemId, language, code) => {
  try {
    const response = await api.post('/submit', {
      problemId,
      language,
      code
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to submit solution' };
  }
};

// Get submission status
export const getSubmissionStatus = async (submissionId) => {
  try {
    const response = await api.get(`/submission/${submissionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch submission status' };
  }
};

// Get all submissions for a problem
export const getProblemSubmissions = async (problemId) => {
  try {
    const response = await api.get(`/problem/${problemId}/submissions`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch problem submissions' };
  }
};

// Get all user submissions
export const getUserSubmissions = async (page = 1, limit = 20) => {
  try {
    const response = await api.get('/submissions', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user submissions' };
  }
};

export default {
  submitSolution,
  getSubmissionStatus,
  getProblemSubmissions,
  getUserSubmissions
};
