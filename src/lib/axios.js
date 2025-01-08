import axios from 'axios';

// Create a custom Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // API URL from env variable
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // Ensures credentials (cookies) are sent with each request
});

// Add response interceptor to handle token refresh on 401 errors
axiosInstance.interceptors.response.use(
  (response) => response, // If request is successful, return response
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 Unauthorized error and retry request if necessary
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshResponse = await axiosInstance.post('/auth/refresh/', {}, {
          withCredentials: true,  // Ensure cookies are sent when refreshing the token
        });

        const { accessToken } = refreshResponse.data;

        // Update the Axios instance with the new access token
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        // Retry the original request with the new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Reject all other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
