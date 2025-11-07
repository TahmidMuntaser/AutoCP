import axios from 'axios';

const API_URL = 'http://localhost:3000/api/generate-testcase';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Generate testcases for a problem
export const generateTestcases = async (problemId) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${API_URL}/generate/${problemId}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get testcases for a problem
export const getTestcases = async (problemId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      `${API_URL}/${problemId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete testcases for a problem
export const deleteTestcases = async (problemId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(
      `${API_URL}/${problemId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Regenerate testcases for a problem
export const regenerateTestcases = async (problemId) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `${API_URL}/regenerate/${problemId}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
