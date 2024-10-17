import axios from 'axios';
// https://emergency-system-0suq.onrender.com/api/v1/auth
const API_URL = 'https://testapi-diww.onrender.com/';  // Replace with your API URL
// const API_URL = 'https://emergency-system-0suq.onrender.com/api/v1/auth/';  // Replace with your API URL


// User Signup API call
export const signup = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}register`, userData);
        console.log('The response data is',response.data);
        return response.data;
    } catch (error) {
        throw error.response.data;  // Catch the API error response
    }
};

// User Login API call
export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}login`, credentials);
        return response.data;  // Usually, this will include the token
    } catch (error) {
        throw error.response.data;
    }
};
