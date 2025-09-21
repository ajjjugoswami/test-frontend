// API Configuration
const API_BASE_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS: { [key: string]: string } = {
  SIGNIN: `${API_BASE_URL}/api/signin`,
  SIGNUP: `${API_BASE_URL}/api/signup`,
};

export default API_BASE_URL;