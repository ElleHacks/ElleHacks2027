import axios from "axios";

export const TOKEN_KEY = "ellehacks-2027-token";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Pulls a readable message out of an axios error
export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") =>
  error.response?.data?.message || fallback;

export default API;
