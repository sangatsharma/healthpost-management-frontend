import axios, { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { idbPersister } from '@/lib/idbPersister';
import { fetchRefreshToken } from '@/hooks/useAuthQuery';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    // 'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  if (
    !navigator.onLine &&
    config.url &&
    config.method &&
    ['post', 'put', 'delete', 'patch'].includes(config.method)
  ) {
    // Save to IndexedDB for later sync
    await idbPersister.saveOfflineMutation(config.url, {
      method: config.method,
      data: Object.fromEntries((config.data as FormData).entries()),
    });

    // Reject the request to trigger the response error handler
    return Promise.reject(
      new axios.AxiosError(
        'Offline: request saved for later sync',
        'ERR_OFFLINE',
        config,
      ),
    );
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    errorHandler(err);
    return Promise.reject(err);
  },
);

const errorHandler = (error: unknown) => {
  if (isAxiosError(error)) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (error?.response?.data?.error === 'TokenExpiredError') {
            fetchRefreshToken().then((data) => {
              if (data) {
                window.location.reload();
              }
            });
          } else {
            toast.error(
              error?.response?.data?.message ||
                'Session expired. Please log in again',
            );
          }
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
      toast.error(error.message || 'Request setup error');
    }
  } else {
    toast.error('An unknown error occurred');
  }
};
