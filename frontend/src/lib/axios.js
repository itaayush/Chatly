import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5001" : window.location.origin);

export const axiosInstance = axios.create({
  baseURL: `${apiUrl}/api`,
  withCredentials: true,
});
