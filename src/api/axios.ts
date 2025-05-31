import axios from 'axios';
//todo: change to user API endpoint
const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: response/error interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Optionally handle global logout
      console.warn('Unauthorized - maybe redirect to login');
    }
    return Promise.reject(err);
  },
);
