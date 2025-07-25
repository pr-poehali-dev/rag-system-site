// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://d9dbd7681a99.ngrok-free.app',
  ENDPOINTS: {
    CHAT: '/api/chat',
    DOCUMENTS: '/api/documents',
    SEARCH: '/api/search'
  }
};

// API Client function
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true', // Skip ngrok warning page
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }
  
  return response.json();
};