import toast from "react-hot-toast";
import axiosInstance, { axiosInstanceforAuth } from "./axios";

// Login function
export const login = async (username, password) => {
  console.log(username, password);
  try {
    // Use the Axios instance to send a POST request for login
    const response = await axiosInstanceforAuth.post('/auth/login/', {
      username,
      password,
    });
    toast.success(response.data?.detail)
    return response.data;  // Return the response data (e.g., tokens, user data)
  } catch (error) {
    // Handle error (e.g., invalid credentials)
    throw error.response?.data || error;  // Throw the error message from the API
  }
};


// Registration function
export const register = async (formData) => {
  try {
    const response = await axiosInstanceforAuth.post('/auth/register/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success(response.data?.detail || 'Registration successful!');
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.';
    toast.error(errorMessage);
    throw error.response?.data || error;
  }
};

// Registration function
export const otpresend = async (email) => {
  try {
    const response = await axiosInstanceforAuth.post('/auth/resend-otp/', {"email":email}, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success("Otp resended successfully.");
  } catch (error) {
    const errorMessage = error.response?.data?.detail || 'Otp resend failed.';
    toast.error(errorMessage);
    throw error.response?.data || error;
  }
};

export const otpverification = async (email,otp) => {
  try {
    console.log({"email":email,"otp":otp})
    const response = await axiosInstanceforAuth.post('/auth/verify-otp/', {"email":email,"otp":otp}, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    const errorMessage = error.response?.data?.detail || 'Invalid OTP ';
    toast.error(errorMessage);
    throw error.response?.data || error;
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
