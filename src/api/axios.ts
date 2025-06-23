import axios, { isAxiosError } from 'axios';
import { toast } from 'sonner';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    // 'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log('Error in axios interceptor:', err);
    errorHandler(err);
    return Promise.reject(err);
  },
);

const errorHandler = (error: unknown) => {
  if (isAxiosError(error)) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          toast.error(
            error?.response?.data?.message ||
              'Session expired. Please log in again',
          );
          break;
        case 403:
          toast.warning(
            error?.response?.data?.message ||
              'You do not have permission to access this resource',
          );
          break;
        case 404:
          toast.error(
            error?.response?.data?.message ||
              'The requested resource was not found',
          );
          break;
        case 500:
          toast.error(
            error?.response?.data?.message ||
              'A server error occurred. Please try again later',
          );
          break;
        default:
          toast.error(error?.response?.data?.message || 'An error occurred');
      }
    } else if (error.request) {
      // Request was made but no response received
      toast.error('Network error. Please check your connection');
    } else {
      // Something happened in setting up the request
      toast.error('Request setup error');
    }
  } else {
    toast.error('An unknown error occurred');
  }
};
