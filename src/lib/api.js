import axiosInstance from "./axios";

// Login function
export const login = async (username, password) => {
  try {
    // Use the Axios instance to send a POST request for login
    const response = await axiosInstance.post('/auth/login/', {
      username,
      password,
    });

    return response.data;  // Return the response data (e.g., tokens, user data)
  } catch (error) {
    // Handle error (e.g., invalid credentials)
    throw error.response?.data || error;  // Throw the error message from the API
  }
};

// Logout function
export const logout = async () => {
  try {
    // Use the Axios instance to send a POST request for logout
    await axiosInstance.post('/auth/logout/');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
