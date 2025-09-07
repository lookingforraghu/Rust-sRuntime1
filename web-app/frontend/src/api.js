// API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// API functions
export const apiHello = async () => {
  try {
    console.log('Calling apiHello...');
    const result = await apiCall('/api/hello');
    console.log('apiHello result:', result);
    return result;
  } catch (error) {
    console.error('apiHello error:', error);
    throw error;
  }
};

export const apiSummarize = async (text) => {
  try {
    console.log('Calling apiSummarize with text:', text);
    const result = await apiCall('/api/summarize', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    console.log('apiSummarize result:', result);
    return result;
  } catch (error) {
    console.error('apiSummarize error:', error);
    throw error;
  }
};
