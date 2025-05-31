import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000,
      retry: 1,
    },
  },
});

// const errorHandler = (error: unknown) => {
//   if (isAxiosError(error)) {
//     if (error.response) {
//       switch (error.response.status) {
//         case 401:
//           // todo Handle unauthorized errors (e.g., redirect to login)
//           break;
//         case 403:
//           toast.error('You do not have permission to access this resource');
//           break;
//         case 404:
//           toast.error('The requested resource was not found');
//           break;
//         case 500:
//           toast.error('A server error occurred. Please try again later');
//           break;
//         default:
//           toast.error(error.response.data.message || 'An error occurred');
//       }
//     } else if (error.request) {
//       // Request was made but no response received
//       toast.error('Network error. Please check your connection');
//     } else {
//       // Something happened in setting up the request
//       toast.error('Request setup error');
//     }
//   } else if (error instanceof Error) {
//     toast.error(error.message);
//   } else {
//     toast.error('An unknown error occurred');
//   }
// };
