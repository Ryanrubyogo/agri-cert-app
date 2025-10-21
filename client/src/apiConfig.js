import axios from 'axios';

// Get the API base URL from the environment variables.
// Vite exposes env variables prefixed with VITE_ on the import.meta.env object.
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Create a new Axios instance with the base URL configured.
const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

export default apiClient;